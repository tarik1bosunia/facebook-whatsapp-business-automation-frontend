'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = true

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Prevent flash of protected content
  }

  return <>{children}</>
}
