import {TaskParamType, TaskType} from '@/types/Task';
import { WorkflowTask } from '@/types/workflow';
import {  LucideProps, SendIcon } from 'lucide-react';

export const DeliverViaWebHookTask ={
    type:TaskType.DELIVER_VIA_WEBHOOK,
    label:"Deliver via WebHook",
    icon:(props:LucideProps)=>( <SendIcon className='stroke-blue-400'{...props}/>),
    isEntryPoint:false,
    credits:1,
    inputs:[
        {   
            name:"Target URL",
            type:TaskParamType.STRING,  
            required:true,
        },
        {
            name:"Body",
            type:TaskParamType.STRING,  
            required:true,  
        }
    ]as const,
    outputs:[
    ]as const,
} satisfies WorkflowTask ;