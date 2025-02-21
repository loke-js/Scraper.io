"use client"

import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useNodesState } from '@xyflow/react'
import React from 'react'
import "@xyflow/react/dist/style.css";
import { TaskType } from '@/types/Task';
import createFlowNode from '@/lib/workflow/createFlowNode';
import NodeComponent from './nodes/NodeComponent';

const nodeTypes = {
        Node:NodeComponent,
}

const snapGrid : [number,number] =[40,40];
const fitViewOptions = {padding:1,maxZoom:1};
function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([
        createFlowNode(TaskType.LAUNCH_BROWSER)
    ]);
    const [edges, setEdges, onEdgesChange] = useNodesState([]);

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                snapToGrid
                fitViewOptions={fitViewOptions}
                snapGrid={snapGrid}
                fitView
                >
                    <Controls  position='top-left' fitViewOptions={fitViewOptions} />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
        </main>
    )
}

export default FlowEditor
