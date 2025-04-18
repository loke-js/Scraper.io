import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { NavigateUrlTask } from "../task/NavigateUrlTask";
export async function NavigateUrlExecutor(environment: ExecutionEnvironment<typeof NavigateUrlTask>): Promise<boolean> {
    try {
        const url = environment.getInput("URL");
        if(!url){
            environment.log.error("URL is required");
            return false;
        }
        await waitFor(1000); // wait 1 seconds before navigating to the URL to avoid potential navigation issues
        await environment.getPage()!.goto(url);
        environment.log.info(`visited ${url}`);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}