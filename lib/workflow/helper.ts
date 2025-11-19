import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export function CalculateWorkflowCost(nodes:AppNode[]){
    console.log(nodes);
    console.log(TaskRegistry[nodes[0].data.type].credits);
    return nodes.reduce((acc,node)=>acc+(TaskRegistry[node.data.type].credits),0);
}