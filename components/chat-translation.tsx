"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, MessageSquare, Send } from "lucide-react"

interface ChatTranslationProps {
  isEnabled: boolean
  onSendMessage: (message: string, translate: boolean) => void
}

interface Message {
  id: string
  text: string
  translated?: string
  sender: "me" | "remote"
  timestamp: Date
}

interface Language {
  code: string
  name: string
}

export function ChatTranslation({ isEnabled, onSendMessage }: ChatTranslationProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [translateMessages, setTranslateMessages] = useState(true)
  const [myLanguage, setMyLanguage] = useState("en")
  const [remoteLanguage, setRemoteLanguage] = useState("es")

  // Sample languages
  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ru", name: "Russian" },
    { code: "ar", name: "Arabic" },
  ]

  // Simulate receiving a message from the remote user
  useEffect(() => {
    if (!isEnabled) return

    // Add a welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Hello! Messages will be translated automatically.",
      sender: "remote",
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])

    // Simulate a response after sending a message
    const simulateResponse = (myMessage: string) => {
      // Simple responses based on input
      let responseText = "I'm not sure how to respond to that."

      if (myMessage.toLowerCase().includes("hello") || myMessage.toLowerCase().includes("hi")) {
        responseText = "Hello there! How can I help you today?"
      } else if (myMessage.toLowerCase().includes("how are you")) {
        responseText = "I'm doing well, thank you for asking! How about you?"
      } else if (myMessage.toLowerCase().includes("help")) {
        responseText = "I'd be happy to help. What do you need assistance with?"
      } else if (myMessage.toLowerCase().includes("bye")) {
        responseText = "Goodbye! Have a great day!"
      }

      // Simulate translation delay
      setTimeout(() => {
        const translatedText = translateMessages ? `[Translated] ${responseText}` : undefined

        const newMessage: Message = {
          id: Date.now().toString(),
          text: responseText,
          translated: translatedText,
          sender: "remote",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, newMessage])
      }, 1500)
    }

    return () => {
      // Clean up any timers or listeners
    }
  }, [isEnabled])

  const handleSendMessage = () => {
    if (!message.trim() || !isEnabled) return

    // Create a new message
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "me",
      timestamp: new Date(),
    }

    // Add to messages
    setMessages((prev) => [...prev, newMessage])

    // Call the callback
    onSendMessage(message, translateMessages)

    // Clear input
    setMessage("")

    // Simulate a response
    setTimeout(() => {
      simulateResponse(message)
    }, 2000)
  }

  const simulateResponse = (myMessage: string) => {
    // Simple responses based on input
    let responseText = "I'm not sure how to respond to that."

    if (myMessage.toLowerCase().includes("hello") || myMessage.toLowerCase().includes("hi")) {
      responseText = "Hello there! How can I help you today?"
    } else if (myMessage.toLowerCase().includes("how are you")) {
      responseText = "I'm doing well, thank you for asking! How about you?"
    } else if (myMessage.toLowerCase().includes("help")) {
      responseText = "I'd be happy to help. What do you need assistance with?"
    } else if (myMessage.toLowerCase().includes("bye")) {
      responseText = "Goodbye! Have a great day!"
    }

    // Simulate translation delay
    setTimeout(() => {
      const translatedText = translateMessages ? `[Translated] ${responseText}` : undefined

      const newMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        translated: translatedText,
        sender: "remote",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isEnabled) {
    return (
      <div className="p-4 text-center">
        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Chat translation is not enabled for this session.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Language selector */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex-1">
          <Select value={myLanguage} onValueChange={setMyLanguage}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="My language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Globe className="h-4 w-4 text-muted-foreground" />

        <div className="flex-1">
          <Select value={remoteLanguage} onValueChange={setRemoteLanguage}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Remote language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 border rounded-md p-2 mb-2 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <p>No messages yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-2 ${
                    msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.translated && <p className="text-xs mt-1 opacity-80">{msg.translated}</p>}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{formatTime(msg.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Translation toggle */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">Auto-translate messages</span>
        <Button
          variant={translateMessages ? "default" : "outline"}
          size="sm"
          onClick={() => setTranslateMessages(!translateMessages)}
        >
          {translateMessages ? "On" : "Off"}
        </Button>
      </div>
    </div>
  )
}
