"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { socketManager } from "@/lib/socket"

interface Message {
  id: string
  sender: "local" | "remote"
  text: string
  timestamp: Date
}

interface SessionChatProps {
  onSendMessage?: (message: string) => void
  remoteUser?: string
  initialMessages?: Message[]
  sessionId?: string
}

export function SessionChat({
  onSendMessage,
  remoteUser = "Remote User",
  initialMessages = [],
  sessionId,
}: SessionChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Connect to socket when component mounts
  useEffect(() => {
    if (sessionId) {
      // Ensure socket connection
      if (!socketManager.isConnected()) {
        socketManager.connect()
      }

      // Register for this session
      socketManager.registerSession(sessionId, "client")

      // Handle connection status
      socketManager.onConnect(() => {
        setIsConnected(true)
        console.log("Chat socket connected")
      })

      socketManager.onDisconnect(() => {
        setIsConnected(false)
        console.log("Chat socket disconnected")
      })

      // Handle incoming messages
      socketManager.onSignalingMessage("chat", (data) => {
        receiveMessage(data.text)
      })
    }

    return () => {
      // Clean up listeners when component unmounts
      if (sessionId) {
        socketManager.removeSignalingHandler("chat")
      }
    }
  }, [sessionId])

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "local",
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])

    // Send via socket if connected
    if (sessionId && isConnected) {
      socketManager.sendSignalingMessage("chat", sessionId, { text: inputValue })
    }

    // Also use the callback if provided
    if (onSendMessage) {
      onSendMessage(inputValue)
    }

    setInputValue("")
  }

  // Function to receive messages from remote user
  const receiveMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "remote",
      text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
  }

  // Expose the receiveMessage function to the parent component
  useEffect(() => {
    if (window) {
      window.receiveRemoteMessage = receiveMessage
    }

    return () => {
      if (window) {
        delete window.receiveRemoteMessage
      }
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
        <h3 className="font-medium text-sm">Chat with {remoteUser}</h3>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
          <span className="text-xs">{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            <p>No messages yet</p>
            <p>Start the conversation by sending a message</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[80%] rounded-lg p-3",
                message.sender === "local" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
            >
              <div className="flex items-center gap-1 mb-1">
                {message.sender === "local" ? <User className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                <span className="text-xs font-medium">
                  {message.sender === "local" ? user?.name || "You" : remoteUser}
                </span>
              </div>
              <p className="text-sm break-words">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 self-end">{formatTime(message.timestamp)}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!inputValue.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Add the global type definition
declare global {
  interface Window {
    receiveRemoteMessage?: (message: string) => void
    receiveLocalMessage?: (message: string) => void
  }
}
