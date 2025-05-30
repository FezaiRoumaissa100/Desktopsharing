import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123", // In a real app, this would be hashed
  },
]

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password, // In a real app, this would be hashed
    }

    // Add user to database
    users.push(newUser)

    // In a real app, you would create a session or JWT token here
    const token = "mock-jwt-token"

    // Return user data (excluding password) and token
    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
