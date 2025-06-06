import "server-only";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode, AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/Task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";


export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
    const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
        include: { workflow: true, phases: true },
    })
    if (!execution) {
        throw new Error(`Workflow execution not found with id: ${executionId}`);
    }
    const edges = JSON.parse(execution.definition).edges as Edge[];
    // Setup execution environment
    const environment: Environment = {
        phases: {

        }
    };
    //initialize workflow execution
    await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt);
    // initialize phases status
    await initializePhasesStatuses(execution);
    let executionFailed = false;
    let creditsConsumed = 0;
    for (const phase of execution.phases) {
        // consume credits
        const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);
        creditsConsumed += phaseExecution.creditsConsumed;
        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
        // : execute phase

    }

    // finalize execution
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);

    //  Cleanup environment
    await cleanUpEnvironment(environment);


    revalidatePath("/workflows/runs");
}


async function initializeWorkflowExecution(executionId: string, workflowId: string, nextRunAt?: Date) {
    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING,
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
            ...(nextRunAt && { nextRunAt })
        }
    })
}

async function initializePhasesStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phases: any) => phases.id),
            },
        },
        data: {
            status: ExecutionPhaseStatus.PENDING,
        }
    })
}

async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;
    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed,
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId,
        },
        data: {
            lastRunStatus: finalStatus,
        }
    }).catch((err) => {
        // ignore this means we have triggerd other runs for workflow while and exxecution wwas running

    });
}

async function executeWorkflowPhase(
    phase: ExecutionPhase,
    environment: Environment,
    edges: Edge[],
    userId: string
) {

    const logCollector = createLogCollector();

    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;

    setupEnvironmentForPhase(node, environment, edges);
    // Update the phase status
    await prisma.executionPhase.update({
        where: { id: phase.id },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs),
        }
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;

    // TODO:decrement user balance

    let success = await decrementCredits(userId, creditsRequired, logCollector);
    const creditsConsumed = success ? creditsRequired : 0;
    if (success) {
        // we can execute if credits are sufficient
        success = await executePhase(phase, node, environment, logCollector);
    }
    const outputs = environment.phases[node.id].outputs;
    await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);
    return {
        success,
        creditsConsumed
    };
}

async function finalizePhase(phaseId: string, success: boolean, outputs: any, logCollector: LogCollector, creditsConsumed: number) {
    const finalStatus = success ?
        ExecutionPhaseStatus.COMPLETED
        : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: { id: phaseId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            outputs: JSON.stringify(outputs),
            creditsConsumed,
            logs: {
                createMany: {
                    data: logCollector.getAll().map(log => ({
                        message: log.message,
                        timestamp: log.timestamp,
                        logLevel: log.level,
                    }))
                }
            }
        }
    });

}

async function executePhase(
    phase: ExecutionPhase,
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];
    if (!runFn) {
        logCollector.error(`Not found executor for ${node.data.type}`)
        return false;
    }
    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);
    return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
    environment.phases[node.id] = { inputs: {}, outputs: {} };
    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }
        // Get inputs from outputs in environment
        const connectedEdge = edges.find(edge => edge.target === node.id && edge.targetHandle === input.name);
        if (!connectedEdge) {
            console.error(`Missing edge for input: ${input.name} in node ${node.id}`);
            continue;
        }
        const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
        environment.phases[node.id].inputs[input.name] = outputValue;
    }
}

function createExecutionEnvironment(node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<any> {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],
        setOutput: (name: string, value: string) => {
            environment.phases[node.id].outputs[name] = value;
        },
        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => (environment.browser = browser),

        getPage: () => environment.page,
        setPage: (page: Page) => (environment.page = page),
        log: logCollector,
    }
}

async function cleanUpEnvironment(environment: Environment) {
    if (environment.browser) {
        await environment.browser.close().catch(err => console.error("Cannot Close browser",err));
    }
}

async function decrementCredits(
    userId: string,
    amount: number,
    logCollector: LogCollector
) {
    try {
        await prisma.userBalance.update({
            where: {
                userId,
                credits: { gte: amount },
            },
            data: {
                credits: {
                    decrement: amount
                }
            }
        });

        return true;
    } catch (error) {
        logCollector.error("insufficient balance");
        return false;
    }
}