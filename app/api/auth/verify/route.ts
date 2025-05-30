import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // In a real app, you would verify the JWT token
    // For this demo, we'll just check if it's our mock token
    if (token !== "mock-jwt-token") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Return the demo user
    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
