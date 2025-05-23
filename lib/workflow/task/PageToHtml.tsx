import {TaskParamType, TaskType} from '@/types/Task';
import { WorkflowTask } from '@/types/workflow';
import { CodeIcon, LucideProps } from 'lucide-react';

export const PageToHtmlTask ={
    type:TaskType.PAGE_TO_HTML,
    label:"Get HTML from page",
    icon:(props:LucideProps)=>( <CodeIcon className='stroke-rose-400'{...props}/>),
    isEntryPoint:false,
    credits: 2,
    inputs:[
        {
            name:"Web Page",
            type:TaskParamType.BROWSER_INSTANCE,  
            required:true,
            hideHandle:false
        }
    ]as const,
    outputs:[
        {
            name:"Html",
            type:TaskParamType.STRING
        },
        {
            name:"Web page",
            type:TaskParamType.BROWSER_INSTANCE,
        }
    ]as const,
} satisfies WorkflowTask;