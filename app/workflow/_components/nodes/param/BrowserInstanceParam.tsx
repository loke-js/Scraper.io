"use client"

import { paramProps } from '@/types/appNode'
import React from 'react'

function BrowserInstanceParam({param}:paramProps) {
  return (
    <p className='text-xs'>
      {param.name}
    </p>
  )
}

export default BrowserInstanceParam
