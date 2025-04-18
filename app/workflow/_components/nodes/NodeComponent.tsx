"use client"
import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { NodeInputs, NodeInput } from "./NodeInputs";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const NodeComponent = memo((props: NodeProps) => {
    const NodeData = props.data as AppNodeData;
    const task = TaskRegistry[NodeData.type];
    return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
        {DEV_MODE && <Badge>DEV:{props.id}</Badge>}
        
        <NodeHeader taskType={NodeData.type} nodeId={props.id} />
        <NodeInputs>
            {task.inputs.map(input => (
                <NodeInput key={input.name} nodeId={props.id} input={input} />
            ))}
        </NodeInputs>
        <NodeOutputs>
            {task.outputs.map(output => (
                <NodeOutput key={output.name}  output={output} />
            ))}
        </NodeOutputs>
    </NodeCard>
})

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";