"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Bell, Info, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface NotificationProps {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

export function Notification({ id, type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) {
        setTimeout(onClose, 300) // Allow time for exit animation
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) {
      setTimeout(onClose, 300) // Allow time for exit animation
    }
  }

  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-brand-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-brand-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-brand-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "info":
        return "bg-brand-50 border-brand-200"
      case "success":
        return "bg-brand-50 border-brand-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-brand-50 border-brand-200"
    }
  }

  return (
    <div
      className={cn(
        "fixed right-4 max-w-sm rounded-lg border p-4 shadow-md transition-all duration-300",
        getBgColor(),
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-full p-1 hover:bg-muted"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function NotificationContainer({ children }: { children: React.ReactNode }) {
  return <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">{children}</div>
}
