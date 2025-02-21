"use client"
import { TaskParam } from '@/types/Task'
import React from 'react'

function NodeParamField({param}:{param:TaskParam}) {
  
    switch(param.type){
        default:
            return <div className="w-full">
                <p className="text-xs text-muted-foreground">Not Implemented</p>
            </div>
    }
}

export default NodeParamField
