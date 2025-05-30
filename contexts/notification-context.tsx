"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Use useCallback to prevent recreation on each render
  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = { ...notification, id }

    setNotifications((prev) => [...prev, newNotification])

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }, [])

  // Use useCallback to prevent recreation on each render
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
