"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { ProtectedRoute } from "@/components/protected-route"
import { SessionChat } from "@/components/session-chat"
import { FileSharing } from "@/components/file-sharing"
import { ClipboardSync } from "@/components/clipboard-sync"
import { MobileTouchControls } from "@/components/mobile-touch-controls"
import { ArrowLeft, MonitorX, Loader2, MessageSquare, Clipboard, FileUp, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PermissionRequest } from "@/components/permission-request"

export default function RemoteSessionPage() {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const searchParams = useSearchParams()
  const router = useRouter()
  const connectionCode = searchParams.get("code")
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [remoteClipboardContent, setRemoteClipboardContent] = useState("")
  const [showPermissionRequest, setShowPermissionRequest] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!connectionCode) {
      addNotification({
        type: "error",
        title: "Invalid Connection",
        message: "No connection code provided",
        duration: 5000,
      })
      router.push("/connect")
      return
    }

    // Simulate connection establishment
    const connectTimeout = setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)

      addNotification({
        type: "success",
        title: "Connected",
        message: `Connected to remote session with code: ${connectionCode}`,
        duration: 5000,
      })

      // Simulate permission request after 5 seconds
      setTimeout(() => {
        setShowPermissionRequest(true)
      }, 5000)

      // For demo purposes, let's draw something on the canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          // Set canvas dimensions
          canvas.width = canvas.clientWidth
          canvas.height = canvas.clientHeight

          // Fill with a background color
          ctx.fillStyle = "#f0f0f0"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Draw some text
          ctx.font = "24px Arial"
          ctx.fillStyle = "#333"
          ctx.textAlign = "center"
          ctx.fillText(`Remote Session: ${connectionCode}`, canvas.width / 2, canvas.height / 2)

          // Draw a message about the demo
          ctx.font = "16px Arial"
          ctx.fillText("This is a demo of the remote session view", canvas.width / 2, canvas.height / 2 + 40)
        }
      }
    }, 2000)

    return () => {
      clearTimeout(connectTimeout)
    }
  }, [connectionCode, router, addNotification])

  const handleDisconnect = () => {
    // In a real implementation, this would close the WebRTC connection
    addNotification({
      type: "info",
      title: "Disconnected",
      message: "You have disconnected from the remote session",
      duration: 5000,
    })
    router.push("/connect")
  }

  const handleSendMessage = (message: string) => {
    // In a real implementation, this would send the message through WebRTC
    console.log("Sending message:", message)

    // Simulate receiving a response after a short delay
    setTimeout(() => {
      if (window.receiveRemoteMessage) {
        window.receiveRemoteMessage("I received your message. This is a simulated response.")
      }
    }, 2000)
  }

  const handleSendClipboard = (text: string) => {
    // In a real implementation, this would send the clipboard content through WebRTC
    console.log("Sending clipboard:", text)

    // Simulate success
    addNotification({
      type: "success",
      title: "Clipboard Sent",
      message: "Clipboard content sent to remote device",
      duration: 3000,
    })
  }

  const handleRequestClipboard = () => {
    // In a real implementation, this would request clipboard content through WebRTC
    console.log("Requesting clipboard from remote")

    // Simulate receiving clipboard content
    setTimeout(() => {
      setRemoteClipboardContent("This is simulated clipboard content from the remote device.")

      addNotification({
        type: "info",
        title: "Clipboard Received",
        message: "Received clipboard content from remote device",
        duration: 3000,
      })
    }, 1500)
  }

  const handleSendFile = (file: File) => {
    // In a real implementation, this would send the file through WebRTC
    console.log("Sending file:", file.name, file.size, file.type)
  }

  const handleApprovePermission = () => {
    setShowPermissionRequest(false)
    addNotification({
      type: "success",
      title: "Permission Granted",
      message: "You have granted clipboard access permission",
      duration: 3000,
    })
  }

  const handleDenyPermission = () => {
    setShowPermissionRequest(false)
    addNotification({
      type: "info",
      title: "Permission Denied",
      message: "You have denied clipboard access permission",
      duration: 3000,
    })
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <header className="bg-background border-b p-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push("/connect")} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Connect
            </Button>
            <h1 className="text-lg font-semibold">Remote Session: {connectionCode}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Session Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Session Information</DialogTitle>
                  <DialogDescription>Details about your current remote session</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Connection Code:</div>
                    <div>{connectionCode}</div>
                    <div className="font-medium">Status:</div>
                    <div>{isConnected ? "Connected" : "Disconnected"}</div>
                    <div className="font-medium">Remote User:</div>
                    <div>Remote Device</div>
                    <div className="font-medium">Connection Type:</div>
                    <div>WebRTC (P2P)</div>
                    <div className="font-medium">Encryption:</div>
                    <div>End-to-end encrypted</div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Remote screen view */}
          <div className="flex-1 p-4 flex flex-col h-full">
            {isConnecting ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium">Connecting to remote session...</p>
                  <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                </div>
              </div>
            ) : isConnected ? (
              <div className="flex-1 flex flex-col">
                <div className="bg-card rounded-lg shadow-sm overflow-hidden flex-1 relative">
                  <canvas ref={canvasRef} className="w-full h-full" />
                  <div className="absolute bottom-4 right-4">
                    <MobileTouchControls />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MonitorX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Connection Failed</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Unable to establish connection to the remote computer
                  </p>
                  <Button className="mt-4" onClick={() => router.push("/connect")}>
                    Return to Connect
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar with tools */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l bg-card">
            <Tabs defaultValue="chat">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="files">
                  <FileUp className="h-4 w-4 mr-2" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="clipboard">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Clipboard
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="p-0 h-[calc(100vh-10rem)]">
                <SessionChat
                  onSendMessage={handleSendMessage}
                  remoteUser="Remote Device"
                  sessionId={connectionCode || ""}
                  initialMessages={[
                    {
                      id: "welcome",
                      sender: "remote",
                      text: "Connected to session. You can now chat with the remote user.",
                      timestamp: new Date(),
                    },
                  ]}
                />
              </TabsContent>
              <TabsContent value="files" className="p-0 h-[calc(100vh-10rem)] overflow-y-auto">
                <FileSharing onSendFile={handleSendFile} />
              </TabsContent>
              <TabsContent value="clipboard" className="p-0 h-[calc(100vh-10rem)] overflow-y-auto">
                <ClipboardSync
                  onSendClipboard={handleSendClipboard}
                  onRequestClipboard={handleRequestClipboard}
                  remoteClipboardContent={remoteClipboardContent}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {showPermissionRequest && (
          <PermissionRequest
            permission="clipboard"
            requester="Remote Device"
            onApprove={handleApprovePermission}
            onDeny={handleDenyPermission}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
