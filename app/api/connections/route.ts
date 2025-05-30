import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Mock connections database with expiration times
const connections = [
  {
    id: "123-456-789",
    name: "Office Desktop",
    lastConnected: "2023-05-01T10:30:00Z",
    userId: "1",
    code: "ABC123",
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    active: true,
  },
  {
    id: "987-654-321",
    name: "Home Laptop",
    lastConnected: "2023-04-28T18:45:00Z",
    userId: "1",
    code: "XYZ789",
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    active: true,
  },
]

// Helper function to verify authentication
const verifyAuth = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]
  // In a real app, verify the token
  // For this mock, we'll just return a user ID
  return "1"
}

// Helper function to clean up expired connections
const cleanupExpiredConnections = () => {
  const now = new Date().toISOString()
  connections.forEach((conn) => {
    if (conn.expiresAt < now) {
      conn.active = false
    }
  })
}

export async function GET(request: NextRequest) {
  // Verify authentication
  const userId = verifyAuth(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    cleanupExpiredConnections()

    // Filter connections by user ID and only return active ones
    const userConnections = connections.filter((conn) => conn.userId === userId && conn.active)

    return NextResponse.json(userConnections)
  } catch (error) {
    console.error("Error fetching connections:", error)
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const userId = verifyAuth(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, permissions } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate a unique connection code (6 characters)
    const generateUniqueCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let code = ""
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    // Ensure code is unique
    let connectionCode
    do {
      connectionCode = generateUniqueCode()
    } while (connections.some((conn) => conn.code === connectionCode && conn.active))

    // Create new connection with expiration (1 hour)
    const newConnection = {
      id: uuidv4(),
      name,
      lastConnected: new Date().toISOString(),
      userId,
      code: connectionCode,
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      active: true,
      permissions: permissions || {},
    }

    // Add connection to database
    connections.push(newConnection)

    return NextResponse.json(newConnection)
  } catch (error) {
    console.error("Error creating connection:", error)
    return NextResponse.json({ error: "Failed to create connection" }, { status: 500 })
  }
}

// Endpoint to validate a connection code
export async function PUT(request: NextRequest) {
  // Verify authentication
  const userId = verifyAuth(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Connection code is required" }, { status: 400 })
    }

    cleanupExpiredConnections()

    // Find the connection with the given code
    const connection = connections.find((conn) => conn.code === code && conn.active)

    if (!connection) {
      return NextResponse.json({ error: "Invalid or expired connection code" }, { status: 404 })
    }

    // Update last connected time
    connection.lastConnected = new Date().toISOString()

    // In a real app, you might want to invalidate the code after use
    // connection.active = false;

    return NextResponse.json(connection)
  } catch (error) {
    console.error("Error validating connection:", error)
    return NextResponse.json({ error: "Failed to validate connection" }, { status: 500 })
  }
}
