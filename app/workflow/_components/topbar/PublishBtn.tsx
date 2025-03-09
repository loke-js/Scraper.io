"use client"

import { PublishWorkflow } from '@/actions/workflows/publishWorkflow'
import { UpdateWorkflow } from '@/actions/workflows/updateWorkflow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { UploadIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function PublishBtn({workflowId}:{workflowId:string}) {
    const {toObject} =useReactFlow();
    const generate = useExecutionPlan();
    const mutation = useMutation({
        mutationFn: PublishWorkflow,
        onSuccess:()=>{
            toast.success("Workflow Published",{id:workflowId});
        },
        onError:()=>{
            toast.error("Something went wrong",{id:workflowId});
        }

    })
  return (
    <Button variant={"outline"} className='flex items-center gap-2' onClick={()=>{
        const plan = generate();
      if(!plan){
        // Client side validation
        return;
      }
      toast.loading("Publishing workflow...",{id:workflowId});
      mutation.mutate({
        id:workflowId,
        flowDefinition:JSON.stringify(toObject()),
      })
    }}>
       <UploadIcon size={16} className='stroke-green-400 '/>
       Publish
    </Button>
  )
}

export default PublishBtn
