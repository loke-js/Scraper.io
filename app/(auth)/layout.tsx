import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="flex flex-col justify-center h-screen gap-4 items-center">{children}</div>
  )
}

export default layout