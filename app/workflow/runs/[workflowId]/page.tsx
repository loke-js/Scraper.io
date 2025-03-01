import Topbar from "../../_components/topbar/Topbar";


export default function ExecutionsPage({params}:{params:{workflowId:string}}){
    return (
        <div className="h-full w-full overflow-auto">
            <Topbar workflowId={params.workflowId}  hideButtons title="All runs"/>
        </div>
    )
}