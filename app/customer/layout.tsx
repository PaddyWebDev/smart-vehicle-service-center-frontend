import { getSessionUser } from '@/hooks/user'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
    const session = await getSessionUser()
    if (!session || session.user.role !== Role.CUSTOMER || session === null) {
        redirect("/guest/Login")
    }
    return (
        <main>
            {children}
        </main>
    )
}
