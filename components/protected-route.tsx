"use client"

import { useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { addNotification } = useNotification()

  const verifyAuth = useCallback(async () => {
    setIsChecking(true)
    try {
      const isAuthed = await checkAuth()

      if (!isAuthed) {
        addNotification({
          type: "error",
          title: "Authentication Required",
          message: "Please log in to access this page",
          duration: 5000,
        })
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    } catch (error) {
      console.error("Auth verification error:", error)
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    } finally {
      setIsChecking(false)
    }
  }, [checkAuth, router, pathname, addNotification])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        verifyAuth()
      } else {
        setIsChecking(false)
      }
    }
  }, [isAuthenticated, isLoading, verifyAuth])

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
