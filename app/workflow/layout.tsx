
import Logo from '@/components/Logo'
import { ModeToggle } from '@/components/themeModeToggle'
import { Separator } from '@radix-ui/react-dropdown-menu'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='flex flex-col w-full h-screen'> 
      {children}
      <Separator/>
      <footer className='flex items-center justify-between p-2'>
        <Logo iconSize={16} fontSize="text-xl"/>
        <ModeToggle />
      </footer>
    </div>
  )
}

export default layout
