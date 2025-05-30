"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, X } from "lucide-react"
import type { RemoteControlPermissions } from "@/lib/permissions"

interface PermissionRequestProps {
  permission: keyof RemoteControlPermissions
  requester: string
  onApprove: () => void
  onDeny: () => void
}

export function PermissionRequest({ permission, requester, onApprove, onDeny }: PermissionRequestProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleApprove = () => {
    setIsVisible(false)
    onApprove()
  }

  const handleDeny = () => {
    setIsVisible(false)
    onDeny()
  }

  // Map permission keys to human-readable descriptions
  const permissionDescriptions: Record<keyof RemoteControlPermissions, string> = {
    keyboard: "control your keyboard",
    mouse: "control your mouse",
    lockLocalInput: "lock your local input",
    showRemotePointer: "show a colored pointer",
    audio: "hear your computer's audio",
    clipboard: "access your clipboard",
    fileTransfer: "transfer files",
    fileManager: "access your file system",
    systemInfo: "view system information",
    restart: "restart your computer",
    restrictedView: "view only specific applications",
    recordSession: "record this session",
    remotePrint: "print to your printer",
    whiteboard: "draw on your screen",
    tcpTunneling: "create TCP tunnels",
    privacyMode: "enable privacy mode",
    lockOnDisconnect: "lock your account on disconnect",
  }

  if (!isVisible) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto animate-in slide-in-from-top duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>Permission Request</CardTitle>
        </div>
        <CardDescription>{requester} is requesting additional permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>{requester}</strong> would like to {permissionDescriptions[permission] || permission}.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Only approve this request if you trust this person and understand what they are asking for.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleDeny}>
          <X className="h-4 w-4 mr-2" />
          Deny
        </Button>
        <Button onClick={handleApprove}>
          <Check className="h-4 w-4 mr-2" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  )
}

export function PermissionRequestNotifications() {
  const [requests, setRequests] = useState<
    {
      id: string
      permission: keyof RemoteControlPermissions
      requester: string
    }[]
  >([
    {
      id: "1",
      permission: "clipboard",
      requester: "Remote User",
    },
  ])

  const handleApprove = (id: string) => {
    // In a real implementation, this would update the permissions
    console.log(`Approved permission request ${id}`)
    setRequests(requests.filter((req) => req.id !== id))
  }

  const handleDeny = (id: string) => {
    // In a real implementation, this would notify the requester
    console.log(`Denied permission request ${id}`)
    setRequests(requests.filter((req) => req.id !== id))
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 w-full max-w-md">
      {requests.map((request) => (
        <PermissionRequest
          key={request.id}
          permission={request.permission}
          requester={request.requester}
          onApprove={() => handleApprove(request.id)}
          onDeny={() => handleDeny(request.id)}
        />
      ))}
    </div>
  )
}
