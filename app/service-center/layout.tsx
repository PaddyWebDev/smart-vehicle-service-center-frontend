import { getSessionUser } from '@/hooks/user'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function ServiceCenterLayout({ children }: { children: React.ReactNode }) {
    const session = await getSessionUser()
    if (!session || session.user.role !== Role.SERVICE_CENTER || session === null) {
        redirect("/guest/Login")
    }
    return (
        <main>
            {children}
        </main>
    )
}
