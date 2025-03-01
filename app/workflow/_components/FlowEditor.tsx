"use client"

import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css";
import { TaskType } from '@/types/Task';
import createFlowNode from '@/lib/workflow/createFlowNode';
import NodeComponent from './nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import DeleteableEdge from './edges/DeleteableEdge';
import { TaskRegistry } from '@/lib/workflow/task/registry';

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
}
const edgeTypes = {
    default: DeleteableEdge
}

const snapGrid: [number, number] = [40, 40];
const fitViewOptions = { padding: 1, maxZoom: 1 };
function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport,screenToFlowPosition, updateNodeData  } = useReactFlow();
    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition);
            if (!flow) return;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            if (!flow.viewport) return;
            console.log(flow.viewport.zoom);
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (error) {
                console.log(error);
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
    const onConnect = useCallback(
        (connection:Connection)=>{
       setEdges(edges =>addEdge({...connection,animated:true},edges))
       if(!connection.targetHandle) return;
       const node = nodes.find((nd)=>nd.id===connection.target);
       if(!node) return;
       const nodeInputs = node.data.inputs;
       updateNodeData(node.id,{
        inputs:{
            ...nodeInputs,
            [connection.targetHandle]:""
        }
       })
    },[setEdges,updateNodeData,nodes])
    const isValidConnection = useCallback((connection:Edge|Connection)=>{
        // no self-connection allowed
        if(connection.source===connection.target) return false;
        
        const source = nodes.find((node)=> node.id === connection.source)
        const target = nodes.find((node)=> node.id === connection.target)
        
        if(!source || !target) {
            console.log("invalid connection")
            return false;
        }
        const sourceTask  = TaskRegistry[source.data.type];
        const targetTask  = TaskRegistry[target.data.type];    
        const output = sourceTask.outputs.find(
            (o)=> o.name===  connection.sourceHandle
        )
        const input = targetTask.inputs.find(
            (i)=> i.name ===  connection.targetHandle
        )
        
        if(input?.type!==output?.type){
            console.log("invalid connection:type mismatch");
            return false;
        }
        const hasCycle = (node:AppNode,visited = new Set())=>{
            if(visited.has(node.id)) return false;
            visited.add(node.id);
            for(const outgoer of getOutgoers(node,nodes,edges)){
                if(outgoer.id===connection.source) return true;
                if(hasCycle(node,visited)) return true;
            }
        };
        const detectedCycle = hasCycle(target);
        if(detectedCycle){
            console.log("cycle detected.Don't make cycle")
        }
        return !detectedCycle;
        // return true;
    },[nodes,edges]);
    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapToGrid
                fitViewOptions={fitViewOptions}
                snapGrid={snapGrid}
                fitView
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
            >
                <Controls position='top-left' fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    )
}

export default FlowEditor
