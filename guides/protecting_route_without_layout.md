# 🔐 Protecting Routes in Next.js Without Layout

If you want to protect routes **without using a layout**, here are better and cleaner ways depending on your setup. This guide shows **three practical alternatives** with full examples.

---

## ✅ 1. Page-Level Guard (Simple and Direct)

Add a guard inside each protected page:

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const isAuthenticated = true // Replace with real logic

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
```

# ✅ 2. Higher-Order Component (HOC)
Use an HOC to wrap any page/component with auth logic.

lib/withAuth.tsx

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter()
    const isAuthenticated = true // Replace with actual logic

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login')
      }
    }, [isAuthenticated, router])

    if (!isAuthenticated) return null

    return <Component {...props} />
  }
}
```

### Usage:

```tsx
import withAuth from '@/lib/withAuth'

function DashboardPage() {
  return <h1>Dashboard</h1>
}

export default withAuth(DashboardPage)
```
✅ Best for: Many protected pages/components
✅ DRY and reusable
🚫 Slightly more abstract


# ✅ 3. Middleware (Server-Side Redirect)
Use Next.js middleware for server-side protection using cookies/tokens.

middleware.ts

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Apply to protected paths only
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
```
✅ Best for: Production apps with cookie-based JWT
✅ No client-side flicker
🚫 Needs server-compatible auth (cookies, headers)

#  summery

| Method           | When to Use                                          |
| ---------------- | ---------------------------------------------------- |
| Page-level check | Simple or small apps with few protected pages        |
| HOC              | Many protected pages or reusable UI blocks           |
| Middleware       | Production use with SSR or cookie-based token system |
| Layout           | If wrapping entire app sections (`/dashboard/*`)     |
