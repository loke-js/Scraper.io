"use client"

import { ThemeProvider } from 'next-themes'
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import React, { useState } from 'react'

export function AppProviders({children}:{children:React.ReactNode}){
    const [queryClient] = useState(()=>new QueryClient())
    return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
        {children}
    </ThemeProvider>
    <ReactQueryDevtools/>
    </QueryClientProvider>
    )
}