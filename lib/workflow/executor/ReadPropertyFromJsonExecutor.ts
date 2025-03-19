import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJsonTask";
export async function ReadPropertyFromJsonExecutor(environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>): Promise<boolean> {
    try {
        const jsonData = environment.getInput("JSON");
        if(!jsonData){
            environment.log.error("Input 'JSON' is required");
            return false;
        }
        const propertyName = environment.getInput("Property name");
        if(!propertyName){
            environment.log.error("Input 'Property-name' is required");
            return false;
        }
        const json = JSON.parse(jsonData);
        const propertyValue = json[propertyName];
        if(propertyValue === undefined){
            environment.log.error("Property not found");
            return false;
        }
        environment.setOutput("Property Value",propertyValue);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}