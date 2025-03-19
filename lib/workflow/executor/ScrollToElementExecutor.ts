import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { ScrollToElementTask } from "../task/ScrollToElementTask";
export async function ScrollToElementExecutor(environment: ExecutionEnvironment<typeof ScrollToElementTask>): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("Input->selector not defined");
        }
        await environment.getPage()!.evaluate((selector)=>{
            const element = document.querySelector(selector);
            if(!element){
                throw new Error("element not found");
                
            }
            const top = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({top}); 
        },selector);
        // await waitFor(6000);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}