const { createServer } = require("http")
const { Server } = require("socket.io")
const { parse } = require("url")

// Get port from environment variable or use default
const PORT = process.env.SOCKET_PORT || 3001

// Create HTTP server
const httpServer = createServer((req, res) => {
  const parsedUrl = parse(req.url, true)

  // Simple health check endpoint
  if (parsedUrl.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }))
    return
  }

  res.writeHead(404)
  res.end("Not found")
})

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Connection handler
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Handle session registration
  socket.on("register", ({ sessionId, role }) => {
    console.log(`Client ${socket.id} registered for session ${sessionId} as ${role}`)
    socket.join(sessionId)

    // Notify others in the room that a new user joined
    socket.to(sessionId).emit("user-joined", {
      socketId: socket.id,
      role,
      timestamp: new Date().toISOString(),
    })
  })

  // Handle signaling messages
  socket.on("signaling", (message) => {
    console.log(`Signaling message from ${socket.id}: ${message.type}`)
    // Forward the message to all clients in the session except the sender
    socket.to(message.sessionId).emit("signaling", message)
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`)
    // Get all rooms this socket was in
    const rooms = Array.from(socket.rooms)

    // For each room (except the default room which is the socket ID)
    rooms.forEach((room) => {
      if (room !== socket.id) {
        // Notify others in the room that this user left
        socket.to(room).emit("user-left", {
          socketId: socket.id,
          timestamp: new Date().toISOString(),
        })
      }
    })
  })
})

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}`)
})
