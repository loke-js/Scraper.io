import {TaskParamType, TaskType} from '@/types/Task';
import { GlobeIcon, LucideProps } from 'lucide-react';

export const LaunchBrowserTask ={
    type:TaskType.LAUNCH_BROWSER,
    label:"Launch browser",
    icon:(props:LucideProps)=>( <GlobeIcon className='stroke-rose-400'{...props}/>),
    isEntryPoint:true,
    inputs:[
        {
            name:"Website Url",
            type:TaskParamType.STRING,  
            helperText:"eg: https://google.com",
            required:true,
            hideHandle:true,
        }
    ]
};