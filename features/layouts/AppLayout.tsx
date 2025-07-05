'use client'

import { useEffect, } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'
import { useGetProfileQuery } from '@/lib/redux/features/user/userApi'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode

}) {

  const { data: profile, isLoading, isError, error } = useGetProfileQuery()



  const userRole: "businessman" | "superadmin" = profile?.role ?? "superadmin"
  const pathname = usePathname()
  const router = useRouter()


  // Role-based routing protection
  useEffect(() => {
    if (!isLoading && userRole) {
      const isSuperAdminRoute = pathname.startsWith('/admin/')
      if (isSuperAdminRoute && userRole !== 'superadmin') {
        router.push('/dashboard')
      }
    }
  }, [pathname, userRole, isLoading, router])

  if(isLoading){
    return null
  }


  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   )
  // }


  if (isError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-red-500 text-center">
          Error loading user data
          <br />
          {typeof error === 'object' && 'status' in error ? `(${error.status})` : ''}
        </div>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    )
  }




  return (
    <div className="min-h-screen flex">
      <Sidebar user={profile} />

      <div className="flex-1 flex flex-col md:ml-16">
        <Header
          user={profile}
          businessName="Style Boutique"
        />

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  )
}
