import { type NextRequest, NextResponse } from "next/server"
import { Server as SocketIOServer } from "socket.io"
import { createServer } from "http"

// Store active sessions
const sessions = new Map<string, Set<string>>()

// Initialize Socket.IO server (in a real implementation, this would be a separate service)
let io: SocketIOServer | null = null

// This is a simplified example. In production, you would use a proper WebSocket server
// or a service like Pusher, Socket.io Cloud, etc.
function getSocketIOServer() {
  if (io) return io

  // Create HTTP server
  const httpServer = createServer()

  // Create Socket.IO server
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  // Set up Socket.IO event handlers
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    socket.on("register", ({ sessionId, role }) => {
      console.log(`Client ${socket.id} registered as ${role} for session ${sessionId}`)

      // Add client to session
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, new Set())
      }
      sessions.get(sessionId)?.add(socket.id)

      // Join room for this session
      socket.join(sessionId)
    })

    socket.on("signaling", (message) => {
      console.log(`Signaling message from ${socket.id} for session ${message.sessionId}`)

      // Broadcast to all clients in the session except sender
      socket.to(message.sessionId).emit("signaling", message)
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)

      // Remove client from all sessions
      for (const [sessionId, clients] of sessions.entries()) {
        if (clients.has(socket.id)) {
          clients.delete(socket.id)

          // If session is empty, remove it
          if (clients.size === 0) {
            sessions.delete(sessionId)
          }
        }
      }
    })
  })

  // Start server on a random port
  const PORT = process.env.SOCKET_PORT || 3001
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`)
  })

  return io
}

// API route to create a new session
export async function POST(request: NextRequest) {
  try {
    // Generate a unique session ID
    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Initialize session
    sessions.set(sessionId, new Set())

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

// API route to check session status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const session = sessions.get(sessionId)
    const exists = !!session
    const clientCount = session?.size || 0

    return NextResponse.json({ exists, clientCount })
  } catch (error) {
    console.error("Error checking session:", error)
    return NextResponse.json({ error: "Failed to check session" }, { status: 500 })
  }
}

// Initialize Socket.IO server on module load
getSocketIOServer()
