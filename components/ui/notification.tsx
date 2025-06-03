"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cva } from "class-variance-authority"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationProps {
  type: NotificationType
  title: string
  message: string
  duration?: number
  onClose: () => void
}

const notificationVariants = cva(
  "fixed flex items-start p-4 mb-3 rounded-lg shadow-lg border transition-all duration-300 max-w-md w-full",
  {
    variants: {
      type: {
        success: "bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800",
        error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
        info: "bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800",
        warning: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
      },
      position: {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
      },
    },
    defaultVariants: {
      type: "info",
      position: "top-right",
    },
  },
)

const iconVariants = {
  success: <CheckCircle className="h-5 w-5 text-brand-500 dark:text-brand-400" />,
  error: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
  info: <Info className="h-5 w-5 text-brand-500 dark:text-brand-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
}

export function Notification({ type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`${notificationVariants({ type, position: "top-right" })} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px]"
      }`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3">{iconVariants[type]}</div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="text-sm text-muted-foreground mt-1">{message}</div>
        </div>
        <button
          type="button"
          className="ml-4 flex-shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
