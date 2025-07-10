'use client'
import { useAppSelector } from "@/lib/redux/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;


}>) {
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/dashboard")
        }
    }, [isAuthenticated, router])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">Redirecting to dashboard...</p>
      </div>
    );
  }

    return (

        <div>
            <h1> Without Auth</h1>
            {children}
        </div>

    );
}
