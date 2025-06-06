"use server"

import { prisma } from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function RunWorkflow({workflowId,flowDefinition}: {
    workflowId: string,
    flowDefinition?: string,
}) {
    const { userId } = auth();
    if (!userId) {
        throw new Error("User is not authenticated");
    }
    
    if (!workflowId) {
        throw new Error("Workflow ID is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId
        }
    });

    if (!workflow) {
        throw new Error("Workflow not found");
    }

    let executionPlan: WorkflowExecutionPlan;
    let workflowDefinition = flowDefinition ;
    if (workflow.status === WorkflowStatus.PUBLISHED){
        if (!workflow.executionPlan) {
            throw new Error("no execution plan found in published workflow");
        }
        executionPlan = JSON.parse(workflow.executionPlan);
        workflowDefinition = workflow.definition;
    } else{
        if (!workflowDefinition){
            throw new Error("Workflow definition is not defined");
        }
        const flow = JSON.parse(workflowDefinition);
        const result = FlowToExecutionPlan(flow.nodes, flow.edges);
        if (!result) {
            throw new Error("Flow definition not valid");
        }
        if (!result.executionPlan) {
            throw new Error("No execution plan generated");
        }
        executionPlan = result.executionPlan;
    }

    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId, 
            userId,
            definition:workflowDefinition,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            phases: {
                create: executionPlan.flatMap(phase => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        }
                    })
                })
            }
        },
        select: {
            id: true,
            phases: true,
        }
    })
    if (!execution) {
        throw new Error("Failed to create workflow execution");
    }
    ExecuteWorkflow(execution.id);//run this in background
    redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}