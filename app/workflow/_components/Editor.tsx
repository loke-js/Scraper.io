"use client"

import { Workflow } from '@prisma/client'
import React from 'react'
import { ReactFlowProvider } from "@xyflow/react"
import FlowEditor from './FlowEditor'
import Topbar from './topbar/Topbar'
import TaskMenu from './TaskMenu'
import { FlowValidationContextProvider } from '@/components/context/FlowValidationContext'
import { WorkflowStatus } from '@/types/workflow'
function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider >
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar title="Workflow Editor" subtitle={workflow.name} isPublished={workflow.status === WorkflowStatus.PUBLISHED} workflowId={workflow.id} />
          <div className='flex h-full overflow-auto'>
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </div>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  )
}

export default Editor
