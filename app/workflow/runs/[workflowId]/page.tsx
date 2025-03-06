import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/topbar/Topbar";
import { InboxIcon } from "lucide-react";
import ExecutionTable from "./_components/ExecutionTable";


export default function ExecutionsPage({params}:{params:{workflowId:string}}){
    return (
        <div className="h-full w-full overflow-auto">
            <Topbar workflowId={params.workflowId}   hideButtons title="All runs" subtitle="List of all your workflow runs"/>
            <ExecutionsTableWrapper workflowId = {params.workflowId}/>
        </div>
    )
}

async function ExecutionsTableWrapper({workflowId}:{workflowId:string}){
    const executions = await GetWorkflowExecutions(workflowId);
    if(!executions){
        return <div>No Data</div>
    }
    if(executions.length===0){
        return (<div className="container w-full py-6">
            <div className="flex items-center  flex-col gap-2 justify-center h-full w-full">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                    <InboxIcon size={40} className="stroke-primary"/>
                </div> 
                <div>
                    <p className="font-bold">No runs have been triggered yet for this workflow</p>
                    <p className="text-sm text-muted-foreground">
                        You can trigger a new run in the editor page
                    </p>
                </div>
            </div>
        </div>)
    }

    return(
        <div className="container py-6 w-full">

            <ExecutionTable workflowId={workflowId} initialData={executions}/>
        </div>
    ) 
}