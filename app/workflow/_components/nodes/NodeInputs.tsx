import { cn } from '@/lib/utils'
import { TaskParam } from '@/types/Task'
import { Handle, Position } from '@xyflow/react'
import React, { ReactNode } from 'react'
import NodeParamField from './NodeParamField'


function NodeInputs({children}:{children:ReactNode}) {
  return (
    <div className='flex flex-col divide-y-2 gap-2'>
      {children}
    </div>
  )
}

export function NodeInput({input}:{input:TaskParam}){
    return <div className='flex justify-start relative p-3 bg-secondary w-full'>
        {/* <NodeParamField param={input}>{JSON.stringify(input,null,4)}</pre>
        {!input.hideHandle && <Handle id={input.id} type="target" position={Position.Left} className={cn('!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4')}/>}
    </NodeParamField> */}
    </div>
}
export default NodeInputs
