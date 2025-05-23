import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebHookTask";
export async function DeliverViaWebHookExecutor(environment: ExecutionEnvironment<typeof DeliverViaWebHookTask>): Promise<boolean> {
    try {
        const targetUrl = environment.getInput("Target URL");
        if (!targetUrl) {
            environment.log.error("Input->targetUrl not defined");
        }
        const body = environment.getInput("Body");
        if (!body) {
            environment.log.error("Input->Body not defined");
        }
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        })
        const statusCode = response.status;
        if (statusCode !== 200) {
            environment.log.error(`Failed to deliver via webhook, status code: ${statusCode}`);
            return false;
        }
        const responseBody  = await response.json();
        environment.log.info(JSON.stringify(responseBody,null,4));
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}