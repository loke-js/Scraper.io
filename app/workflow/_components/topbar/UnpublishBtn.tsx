"use client"

import { UnPublishWorkflow } from '@/actions/workflows/unPublishWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { UploadIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function PublishBtn({workflowId}:{workflowId:string}) {
    const mutation = useMutation({
        mutationFn: UnPublishWorkflow,
        onSuccess:()=>{
            toast.success("Workflow UnPublished",{id:workflowId});
        },
        onError:()=>{
            toast.error("Something went wrong",{id:workflowId});
        }

    })
  return (
    <Button variant={"outline"} className='flex items-center gap-2' onClick={()=>{
      
      toast.loading("UnPublishing workflow...",{id:workflowId});
      mutation.mutate(workflowId)
    }}>
       <UploadIcon size={16} className='stroke-green-400 '/>
       UnPublish
    </Button>
  )
}

export default PublishBtn
