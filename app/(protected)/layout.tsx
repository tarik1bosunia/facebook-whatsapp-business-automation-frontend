'use client'

import AppLayout from "@/features/layouts/AppLayout";
import ConnectionStatusBar from "@/features/conversations/components/ConnectionStatusBar";
import { useAppSelector } from "@/lib/redux/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;

}>) {
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login")
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) return null

    return (

        <AppLayout>
            {children}
            <ConnectionStatusBar />

        </AppLayout>

    );
}
