'use client'

import Rediect from "@/components/common/Redirect"
import { useAppSelector } from "@/lib/redux/hooks/reduxHooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {

    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const router = useRouter()


    useEffect(() => {
        const target = isAuthenticated ? '/dashboard' : "/login"
        router.replace(target)
    }, [isAuthenticated, router])

    const text =  `Redirecting you to ${isAuthenticated ? 'Dashboard' : 'Login'}}`
    return <Rediect text={text}/>
    

}
