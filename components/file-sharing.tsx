"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  FileUp,
  FileDown,
  FileIcon,
  FileText,
  FileImage,
  FileArchive,
  FileCode,
  Download,
  Trash2,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNotification } from "@/contexts/notification-context"

interface FileTransfer {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "pending" | "transferring" | "completed" | "failed"
  direction: "upload" | "download"
  url?: string
}

interface FileSharingProps {
  isEnabled?: boolean
  onSendFile?: (file: File) => void
}

export function FileSharing({ isEnabled = true, onSendFile }: FileSharingProps) {
  const [transfers, setTransfers] = useState<FileTransfer[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotification()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Create a new transfer object
    const newTransfer: FileTransfer = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "pending",
      direction: "upload",
    }

    setTransfers((prev) => [...prev, newTransfer])

    // Start the upload process
    startFileUpload(file, newTransfer.id)

    // Reset the file input
    e.target.value = ""
  }

  const startFileUpload = async (file: File, transferId: string) => {
    if (!isEnabled || !onSendFile) {
      setError("File sharing is not enabled for this session")
      return
    }

    try {
      // Update status to transferring
      setTransfers((prev) => prev.map((t) => (t.id === transferId ? { ...t, status: "transferring" } : t)))

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTransfers((prev) => {
          const transfer = prev.find((t) => t.id === transferId)
          if (!transfer || transfer.progress >= 100) {
            clearInterval(progressInterval)
            return prev
          }

          const newProgress = Math.min(transfer.progress + 10, 100)
          return prev.map((t) => (t.id === transferId ? { ...t, progress: newProgress } : t))
        })
      }, 500)

      // In a real implementation, this would send the file through WebRTC
      if (onSendFile) {
        onSendFile(file)
      }

      // Simulate completion after progress reaches 100%
      setTimeout(() => {
        clearInterval(progressInterval)
        setTransfers((prev) =>
          prev.map((t) => (t.id === transferId ? { ...t, status: "completed", progress: 100 } : t)),
        )

        addNotification({
          type: "success",
          title: "File Sent",
          message: `${file.name} was sent successfully`,
          duration: 5000,
        })
      }, 5500)
    } catch (err) {
      console.error("File transfer error:", err)
      setTransfers((prev) => prev.map((t) => (t.id === transferId ? { ...t, status: "failed" } : t)))

      setError(`Failed to send file: ${err instanceof Error ? err.message : "Unknown error"}`)

      addNotification({
        type: "error",
        title: "File Transfer Failed",
        message: `Failed to send ${file.name}`,
        duration: 5000,
      })
    }
  }

  const simulateFileDownload = () => {
    // This is just for demo purposes
    const mockFile: FileTransfer = {
      id: Date.now().toString(),
      name: "document.pdf",
      size: 2.5 * 1024 * 1024, // 2.5 MB
      type: "application/pdf",
      progress: 0,
      status: "pending",
      direction: "download",
    }

    setTransfers((prev) => [...prev, mockFile])

    // Simulate download progress
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += 10
      setTransfers((prev) => prev.map((t) => (t.id === mockFile.id ? { ...t, progress, status: "transferring" } : t)))

      if (progress >= 100) {
        clearInterval(progressInterval)
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === mockFile.id
              ? {
                  ...t,
                  progress: 100,
                  status: "completed",
                  url: "https://example.com/document.pdf", // In a real app, this would be a blob URL
                }
              : t,
          ),
        )

        addNotification({
          type: "success",
          title: "File Received",
          message: "document.pdf was received successfully",
          duration: 5000,
        })
      }
    }, 500)
  }

  const removeTransfer = (id: string) => {
    setTransfers((prev) => prev.filter((t) => t.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-5 w-5" />
    if (type.startsWith("text/")) return <FileText className="h-5 w-5" />
    if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return <FileArchive className="h-5 w-5" />
    if (type.includes("javascript") || type.includes("typescript") || type.includes("html") || type.includes("css"))
      return <FileCode className="h-5 w-5" />
    return <FileIcon className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  if (!isEnabled) {
    return (
      <div className="p-4 text-center">
        <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">File sharing is not enabled for this session.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Request Permission
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="h-4 w-4 mr-2" />
            Send File
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

          <Button variant="outline" className="flex-1" onClick={simulateFileDownload}>
            <FileDown className="h-4 w-4 mr-2" />
            Request File
          </Button>
        </div>

        {transfers.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted p-2 text-sm font-medium">File Transfers</div>
            <div className="divide-y">
              {transfers.map((transfer) => (
                <div key={transfer.id} className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getFileIcon(transfer.type)}
                      <div>
                        <div className="font-medium text-sm">{transfer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(transfer.size)} • {transfer.direction === "upload" ? "Sending" : "Receiving"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {transfer.status === "completed" && transfer.url && (
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                          <a href={transfer.url} download={transfer.name}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTransfer(transfer.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={transfer.progress} className="h-2" />
                  <div className="flex justify-between text-xs mt-1">
                    <span>
                      {transfer.status === "pending"
                        ? "Waiting..."
                        : transfer.status === "transferring"
                          ? "Transferring..."
                          : transfer.status === "completed"
                            ? "Completed"
                            : "Failed"}
                    </span>
                    <span>{transfer.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {transfers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No active file transfers</p>
            <p className="text-sm">Send or request a file to get started</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="text-sm space-y-2">
        <h3 className="font-medium">About File Sharing</h3>
        <p className="text-muted-foreground">
          Files are transferred directly between devices using a secure peer-to-peer connection. No files are stored on
          our servers.
        </p>
        <p className="text-muted-foreground">
          Maximum file size: 100 MB. Supported file types: documents, images, archives, and more.
        </p>
      </div>
    </div>
  )
}
