"use client"

import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react'
import React, { useState } from 'react'
import Logo from './Logo';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import UserAvailableCreditsBadge from './UserAvailableCreditsBadge';

const routes = [
    {
        href: "/",
        label: "Home",
        icon: HomeIcon
    },
    {
        href: "workflows",
        label: "Workflows",
        icon: Layers2Icon
    },
    {
        href: "credentials",
        label: "Credentials",
        icon: ShieldCheckIcon
    },
    {
        href: "billing",
        label: "Billing",
        icon: CoinsIcon
    },
];
const DesktopSidebar = () => {
    const pathName = usePathname();
    const activeRoute = routes.find((route) => {
        if (route.href === "/") {
            return pathName === "/";
        }
        return pathName.startsWith(`/${route.href}`);
    }) || routes[0];
    return (
        <div className='hidden relative md:block  min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate '>
            <div className="flex items-center justify-center gap-2 border-separate p-4 border-b-[1px]">
                <Logo />
            </div>
            <div className="p-2">
                <UserAvailableCreditsBadge/>
            </div>
            <div className="flex flex-col gap-1 p-2">
                {routes.map(route => (
                    <Link key={route.href} href={route.href} className={buttonVariants({
                        variant:
                            activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
                    })}>
                        <route.icon size={20} />
                        {route.label}
                    </Link>
                )
                )}
            </div>
        </div>
    )
}

export function MobileSideBar() {
    const [isOpen, setOpen] = useState(false);
    const pathName = usePathname();
    const activeRoute = routes.find((route) => {
        if (route.href === "/") {
            return pathName === "/";
        }
        return pathName.startsWith(`/${route.href}`);
    }) || routes[0];
    return <div className="block border-separate bg-background md:hidden ">
        <nav className='container flex items-center justify-center px-8'>
            <Sheet open={isOpen} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                        <MenuIcon/>
                    </Button>
                </SheetTrigger>
                <SheetContent className='w-[400px] sm:w-[500px] space-y-4' side={"left"}>
                    <Logo />
                    <div className="flex flex-col gap-1">
                    <UserAvailableCreditsBadge/>
                        {routes.map(route => (
                            <Link key={route.href} href={route.href} className={buttonVariants({
                                variant:
                                    activeRoute.href === route.href ? 'sidebarActiveItem' : 'sidebarItem'
                            })} 
                            onClick={()=>setOpen((prev)=>!prev)}
                            >
                                <route.icon size={20} />
                                {route.label}
                            </Link>
                        )
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    </div>
}

export default DesktopSidebar