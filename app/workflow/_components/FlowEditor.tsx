"use client"

import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css";
import { TaskType } from '@/types/Task';
import createFlowNode from '@/lib/workflow/createFlowNode';
import NodeComponent from './nodes/NodeComponent';
import { AppNode } from '@/types/appNode';

const nodeTypes = {
    Node: NodeComponent,
}

const snapGrid: [number, number] = [40, 40];
const fitViewOptions = { padding: 1, maxZoom: 1 };
function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useNodesState([]);
    const { setViewport,screenToFlowPosition } = useReactFlow();
    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition);
            if (!flow) return;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            if (!flow.viewport) return;
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (error) {

        }
    }, [])
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, [])
    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const taskType = event.dataTransfer.getData("application/reactflow");
        if (typeof taskType === undefined || !taskType) return;
        const position = screenToFlowPosition({
            x:event.clientX,
            y:event.clientY
        });
        const newNode = createFlowNode(taskType as TaskType,position);
        setNodes((nodes) => nodes.concat(newNode));
    }, [])
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
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <Controls position='top-left' fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    )
}

export default FlowEditor
