import {TaskParamType, TaskType} from '@/types/Task';
import { WorkflowTask } from '@/types/workflow';
import { GlobeIcon, LucideProps } from 'lucide-react';

export const LaunchBrowserTask ={
    type:TaskType.LAUNCH_BROWSER,
    label:"Launch browser",
    icon:(props:LucideProps)=>( <GlobeIcon className='stroke-rose-400'{...props}/>),
    isEntryPoint:true,
    credits:5,
    inputs:[
        {
            name:"Website Url",
            type:TaskParamType.STRING,  
            helperText:"eg: https://google.com",
            required:true,
            hideHandle:true,
        }
    ]as const,
    outputs:[
        {
            name:"Web page",
            type:TaskParamType.BROWSER_INSTANCE,
        
        }
    ]as const,
} satisfies WorkflowTask;