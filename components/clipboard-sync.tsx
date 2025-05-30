"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Clipboard, ClipboardCheck, ClipboardCopy, ArrowUpDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNotification } from "@/contexts/notification-context"

interface ClipboardSyncProps {
  isEnabled?: boolean
  onSendClipboard?: (text: string) => void
  onRequestClipboard?: () => void
  remoteClipboardContent?: string
}

export function ClipboardSync({
  isEnabled = true,
  onSendClipboard,
  onRequestClipboard,
  remoteClipboardContent,
}: ClipboardSyncProps) {
  const [localClipboard, setLocalClipboard] = useState("")
  const [remoteClipboard, setRemoteClipboard] = useState(remoteClipboardContent || "")
  const [syncDirection, setSyncDirection] = useState<"bidirectional" | "send" | "receive">("bidirectional")
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { addNotification } = useNotification()

  // Update remote clipboard when prop changes
  useEffect(() => {
    if (remoteClipboardContent) {
      setRemoteClipboard(remoteClipboardContent)
    }
  }, [remoteClipboardContent])

  // Check clipboard permissions
  useEffect(() => {
    if (isEnabled && navigator.clipboard) {
      navigator.permissions
        .query({ name: "clipboard-read" as PermissionName })
        .then((result) => {
          if (result.state === "denied") {
            setError("Clipboard read permission denied. Please enable clipboard access in your browser settings.")
          }
        })
        .catch(() => {
          // Some browsers might not support the permissions API
          console.log("Clipboard permissions API not supported")
        })
    }
  }, [isEnabled])

  const readLocalClipboard = async () => {
    if (!isEnabled) return

    try {
      setError(null)
      const text = await navigator.clipboard.readText()
      setLocalClipboard(text)
      addNotification({
        type: "success",
        title: "Clipboard Read",
        message: "Successfully read from your clipboard",
        duration: 3000,
      })
    } catch (err) {
      console.error("Failed to read clipboard:", err)
      setError("Failed to read clipboard. Please make sure you have granted clipboard permissions.")
      addNotification({
        type: "error",
        title: "Clipboard Error",
        message: "Failed to read from clipboard. Please check permissions.",
        duration: 5000,
      })
    }
  }

  const writeLocalClipboard = async (text: string) => {
    if (!isEnabled) return

    try {
      setError(null)
      await navigator.clipboard.writeText(text)
      setLocalClipboard(text)
      addNotification({
        type: "success",
        title: "Clipboard Updated",
        message: "Text copied to your clipboard",
        duration: 3000,
      })
    } catch (err) {
      console.error("Failed to write to clipboard:", err)
      setError("Failed to write to clipboard. Please make sure you have granted clipboard permissions.")
      addNotification({
        type: "error",
        title: "Clipboard Error",
        message: "Failed to write to clipboard. Please check permissions.",
        duration: 5000,
      })
    }
  }

  const sendToRemote = () => {
    if (!isEnabled || !localClipboard) return

    if (onSendClipboard) {
      onSendClipboard(localClipboard)
      setRemoteClipboard(localClipboard)
      setLastSynced(new Date())
      addNotification({
        type: "success",
        title: "Clipboard Sent",
        message: "Clipboard content sent to remote device",
        duration: 3000,
      })
    }
  }

  const receiveFromRemote = () => {
    if (!isEnabled) return

    if (onRequestClipboard) {
      onRequestClipboard()
      addNotification({
        type: "info",
        title: "Clipboard Requested",
        message: "Requesting clipboard content from remote device",
        duration: 3000,
      })
    }

    // In a real implementation, this would be updated when the remote clipboard is received
    setLastSynced(new Date())
  }

  const syncClipboards = () => {
    if (syncDirection === "send" || syncDirection === "bidirectional") {
      sendToRemote()
    }

    if (syncDirection === "receive" || syncDirection === "bidirectional") {
      receiveFromRemote()
    }
  }

  if (!isEnabled) {
    return (
      <div className="p-4 text-center">
        <Clipboard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Clipboard synchronization is not enabled for this session.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Request Permission
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Local Clipboard</h3>
          <Button variant="ghost" size="sm" onClick={readLocalClipboard}>
            <ClipboardCopy className="h-4 w-4 mr-1" />
            Read
          </Button>
        </div>
        <Textarea
          value={localClipboard}
          onChange={(e) => setLocalClipboard(e.target.value)}
          placeholder="Your clipboard content will appear here"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() =>
            setSyncDirection(
              syncDirection === "bidirectional" ? "send" : syncDirection === "send" ? "receive" : "bidirectional",
            )
          }
        >
          <ArrowUpDown className="h-4 w-4" />
          {syncDirection === "bidirectional"
            ? "Bidirectional"
            : syncDirection === "send"
              ? "Send Only"
              : "Receive Only"}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Remote Clipboard</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => writeLocalClipboard(remoteClipboard)}
            disabled={!remoteClipboard}
          >
            <ClipboardCopy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
        <Textarea
          value={remoteClipboard}
          readOnly
          placeholder="Remote clipboard content will appear here"
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={syncClipboards} className="w-full">
        <ClipboardCheck className="h-4 w-4 mr-2" />
        Sync Clipboards
      </Button>

      {lastSynced && (
        <p className="text-xs text-muted-foreground text-center">Last synced: {lastSynced.toLocaleTimeString()}</p>
      )}
    </div>
  )
}
