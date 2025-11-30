import { getSessionUser } from '@/hooks/user'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import { Home, LucideIcon } from 'lucide-react'
import { linksType } from '@/types/common'
import { SessionProvider } from '@/context/session'
import Sidebar from '@/components/auth-sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import ThemeSwitcher from '@/components/theme-switcher'

export default async function ServiceCenterLayout({ children }: { children: React.ReactNode }) {
    const session = await getSessionUser()
    if (!session || session.user.role !== Role.SERVICE_CENTER || session === null) {
        redirect("/guest/Login")
    }
    const links: linksType[] = [
        {
            label: "Dashboard", href: "/service-center/dashboard", icon: "User"
        }
    ]
    return (
        <SessionProvider session={session}>
            <main className="flex h-dvh w-dvw   dark:bg-neutral-950">
                {/* Sidebar */}
                <Sidebar
                    userId={session.user.id!}
                    userName={session.user.name!}
                    routeName='Service Center'
                    linkList={links}
                />

                {/* Main content area with trigger */}
                <SidebarInset className=" bg-neutral-50 dark:bg-neutral-900">
                    {/* Trigger should be visible at the top-left of content */}
                    <header className="py-2 pl-3  pr-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 justify-between">
                        <div className="flex flew-row items-center gap-2">
                            <SidebarTrigger />
                            <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                                Admin Dashboard
                            </h1>
                        </div>

                        <ThemeSwitcher />
                    </header>

                    {/* Page content */}
                    <div className="flex-1 overflow-y-auto">{children}</div>
                </SidebarInset>
            </main>
        </SessionProvider>
    )
}
