

import {  WorkflowExecutionStatus} from '@/types/workflow'
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, Loader2Icon } from 'lucide-react'
import React from 'react'

export default function WorkflowStatusBadge({status}:{status:WorkflowExecutionStatus}) {
  switch (status){
    case WorkflowExecutionStatus.PENDING:
        return <CircleDashedIcon size={20} className='stroke-muted-foreground'/>;
    case WorkflowExecutionStatus.RUNNING:
        return <Loader2Icon size={20} className='stroke-yellow-500 animate-spin'/>;
    case WorkflowExecutionStatus.FAILED:
        return <CircleXIcon size={20} className='stroke-destructive'/>;
    case WorkflowExecutionStatus.COMPLETED:
        return <CircleCheckIcon size={20} className='stroke-primary'/>;
    default :
    return <div className="rounded-full">{status}</div>
  }
}
