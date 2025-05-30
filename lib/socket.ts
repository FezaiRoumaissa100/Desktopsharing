import { io, type Socket } from "socket.io-client"

// Use the environment variable for the socket server URL
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3001"

interface SignalingMessage {
  type: string
  sessionId: string
  data: any
}

class SocketManager {
  private socket: Socket | null = null
  private messageHandlers: Map<string, (data: any) => void> = new Map()
  private connectionHandlers: Array<() => void> = []
  private disconnectionHandlers: Array<() => void> = []
  private userJoinHandlers: Array<(data: any) => void> = []
  private userLeaveHandlers: Array<(data: any) => void> = []

  connect() {
    if (this.socket) return

    console.log(`Connecting to socket server at ${SOCKET_SERVER_URL}`)

    this.socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    this.socket.on("connect", () => {
      console.log("Connected to signaling server with ID:", this.socket?.id)
      this.connectionHandlers.forEach((handler) => handler())
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from signaling server")
      this.disconnectionHandlers.forEach((handler) => handler())
    })

    this.socket.on("error", (error) => {
      console.error("Socket error:", error)
    })

    this.socket.on("signaling", (message: SignalingMessage) => {
      const handler = this.messageHandlers.get(message.type)
      if (handler) {
        handler(message.data)
      }
    })

    this.socket.on("user-joined", (data) => {
      console.log("User joined:", data)
      this.userJoinHandlers.forEach((handler) => handler(data))
    })

    this.socket.on("user-left", (data) => {
      console.log("User left:", data)
      this.userLeaveHandlers.forEach((handler) => handler(data))
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  registerSession(sessionId: string, role: "host" | "client") {
    if (!this.socket) this.connect()
    this.socket?.emit("register", { sessionId, role })
  }

  sendSignalingMessage(type: string, sessionId: string, data: any) {
    if (!this.socket) this.connect()
    this.socket?.emit("signaling", { type, sessionId, data })
  }

  onSignalingMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler)
  }

  removeSignalingHandler(type: string) {
    this.messageHandlers.delete(type)
  }

  onConnect(handler: () => void) {
    this.connectionHandlers.push(handler)
    // If already connected, call the handler immediately
    if (this.socket?.connected) {
      handler()
    }
  }

  onDisconnect(handler: () => void) {
    this.disconnectionHandlers.push(handler)
  }

  onUserJoin(handler: (data: any) => void) {
    this.userJoinHandlers.push(handler)
  }

  onUserLeave(handler: (data: any) => void) {
    this.userLeaveHandlers.push(handler)
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocketId(): string | null {
    return this.socket?.id || null
  }
}

// Singleton instance
export const socketManager = new SocketManager()
