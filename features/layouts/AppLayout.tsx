'use client'

import { useEffect, useState } from 'react'
import { usePathname, redirect, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode

}) {



  const [user] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as "admin" | "superadmin",
    avatar: "https://i.pravatar.cc/150?u=admin",
  })


  const userRole: "admin" | "superadmin" = "superadmin"
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const isSuperAdminRoute = pathname.startsWith('/admin/')
    if (isSuperAdminRoute && userRole !== 'superadmin') {
      router.push('/dashboard')
    }
  }, [pathname, userRole])

  

  return (
    <div className="min-h-screen flex">
      
      <Sidebar userRole={userRole} />
      
      <div className="flex-1 flex flex-col md:ml-16">
        <Header 
          user={{
            ...user,
            role: userRole,
          }} 
          businessName="Style Boutique"
        />

        
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  )
}