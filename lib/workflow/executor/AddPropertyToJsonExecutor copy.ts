import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { AddPropertyToJsonTask } from "../task/AddPropertyToJsonTask";
export async function AddPropertyToJsonExecutor(environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>): Promise<boolean> {
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
        const propertyValue = environment.getInput("Property value");
        if(!propertyValue){
            environment.log.error("Input 'Property-value' is required");
            return false;
        }
        const json = JSON.parse(jsonData);
        json[propertyName] = propertyValue;
        environment.setOutput("Updated JSON",JSON.stringify(json));
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}