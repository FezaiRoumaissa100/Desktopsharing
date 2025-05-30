const http = require("http")
const { Server } = require("socket.io")
const dotenv = require("dotenv")

dotenv.config()

const PORT = process.env.SOCKET_PORT || 3001
const server = http.createServer()

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Store active sessions
const sessions = new Map()

// Set up Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  socket.on("register", ({ sessionId, role }) => {
    console.log(`Client ${socket.id} registered as ${role} for session ${sessionId}`)

    // Add client to session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, new Set())
    }
    sessions.get(sessionId).add(socket.id)

    // Join room for this session
    socket.join(sessionId)

    // Notify others in the session about the new connection
    socket.to(sessionId).emit("user-joined", { role })
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

        // Notify others in the session about the disconnection
        socket.to(sessionId).emit("user-left", { socketId: socket.id })

        // If session is empty, remove it
        if (clients.size === 0) {
          sessions.delete(sessionId)
        }
      }
    }
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

console.log(`Socket server URL: ${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}`)

module.exports = { io, sessions }
