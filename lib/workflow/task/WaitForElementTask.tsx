import {TaskParamType, TaskType} from '@/types/Task';
import { WorkflowTask } from '@/types/workflow';
import {  EyeIcon, LucideProps } from 'lucide-react';

export const WaitForElementTask ={
    type:TaskType.WAIT_FOR_ELEMENT,
    label:"Wait for element.",
    icon:(props:LucideProps)=>( <EyeIcon className='stroke-orange-400'{...props}/>),
    isEntryPoint:false,
    credits:1,
    inputs:[
        {   
            name:"Web Page",
            type:TaskParamType.BROWSER_INSTANCE,  
            required:true,
        },
        {
            name:"Selector",
            type:TaskParamType.STRING,  
            required:true,  
        },
        {
            name:"Visibility",
            type:TaskParamType.SELECT,
            hideHandle:true,
            required:true,
            options:[
                {label:"Visible",value:"visible"},
                {label:"Hidden",value:"hidden"},
            ]
        },
    ]as const,
    outputs:[
        {
            name:"Web Page",
            type:TaskParamType.BROWSER_INSTANCE,
        },
        
    ]as const,
} satisfies WorkflowTask ;