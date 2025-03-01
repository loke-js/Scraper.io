import BreadCrumbHeader from '@/components/BreadCrumbHeader'
import DesktopSidebar, { MobileSideBar } from '@/components/Sidebar'
import { ModeToggle } from '@/components/themeModeToggle'
import { Separator } from '@/components/ui/separator'
import { SignedIn, UserButton } from '@clerk/nextjs'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen">

            <DesktopSidebar />
            <div className="flex flex-col flex-1 min-h-screen">
                <header className="flex items-center justify-between py-4 px-6 h-[50px] container">
                    <BreadCrumbHeader />
                    <div className="gap-1 flex items-center">
                        <ModeToggle />
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </header>
                <Separator />
                <div className="overflow-auto">
                    <div className="flex-1 container text-accent-foreground py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default layout