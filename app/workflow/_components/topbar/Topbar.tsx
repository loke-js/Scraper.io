"use client"

import TooltipWrapper from '@/components/TooltipWrapper'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'
import SaveBtn from './SaveBtn'
import ExecuteBtn from './ExecuteBtn'
import NavigationTabs from './NavigationTabs'
import PublishBtn from './PublishBtn'
import UnPublishBtn from './UnpublishBtn'
interface Props{
    title:string;
    subtitle?:string;
    workflowId:string; // for saving button state (draft or published)
    hideButtons? :boolean;
    isPublished? :boolean;
}
function Topbar({title,subtitle,workflowId,isPublished,hideButtons=false}:Props) {
    const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky z-10 top-0 bg-background ">
        <div className="flex gap-1 flex-1">
            <TooltipWrapper content="Back">
                <Button variant={"ghost"} size={"icon"} onClick={()=>router.back()}>
                    <ChevronLeftIcon size={20}/>
                </Button>
            </TooltipWrapper>
            <div>
                <p className="font-bold text-ellipsis truncate">{title}</p>
                {subtitle && <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p> }
            </div>
        </div>
        <NavigationTabs workflowId={workflowId}/>
        <div className="flex gap-1 flex-1 justify-end">
            {!hideButtons && <>
                <ExecuteBtn workflowId = {workflowId}/>
                {isPublished && <UnPublishBtn workflowId={workflowId}/>}
                {!isPublished && <>
                <SaveBtn workflowId={workflowId}/>
                <PublishBtn workflowId={workflowId}/>
                </> }
                
            </>}
        </div>
    </header>
  )
}

export default Topbar
