import {TaskParamType, TaskType} from '@/types/Task';
import { WorkflowTask } from '@/types/workflow';
import {  FileJson2Icon, LucideProps, MousePointerClick } from 'lucide-react';

export const ReadPropertyFromJsonTask ={
    type:TaskType.READ_PROPERTY_FROM_JSON,
    label:"Read property from JSON",
    icon:(props:LucideProps)=>( <FileJson2Icon className='stroke-orange-400'{...props}/>),
    isEntryPoint:false,
    credits:1,
    inputs:[
        {   
            name:"JSON",
            type:TaskParamType.STRING,  
            required:true,
        },
        {
            name:"Property name",
            type:TaskParamType.STRING,  
            required:true,  
        }
    ]as const,
    outputs:[
        {
            name:"Property Value",
            type:TaskParamType.STRING,
        },
        
    ]as const,
} satisfies WorkflowTask ;