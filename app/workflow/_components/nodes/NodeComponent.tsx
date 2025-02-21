import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { NodeInputs, NodeInput } from "./NodeInputs";
import { TaskRegistry } from "@/lib/workflow/task/registry";

const NodeComponent = memo((props: NodeProps) => {
    const NodeData = props.data as AppNodeData;
    const task = TaskRegistry[NodeData.type];
    return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
        <NodeHeader taskType={NodeData.type} />
        <NodeInputs>
            {task.inputs.map(input => (
                <NodeInput key={input.name} nodeId={props.id} input={input} />
            ))}
        </NodeInputs>
    </NodeCard>
})

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";