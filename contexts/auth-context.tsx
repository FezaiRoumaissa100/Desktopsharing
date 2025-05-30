"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<boolean>
  updateUserProfile: (data: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for preview/development environment
const MOCK_USER = {
  id: "1",
  name: "Demo User",
  email: "demo@example.com",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkUserAuth = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // Try to get user data from localStorage first
          try {
            const storedUserData = localStorage.getItem("user_data")
            if (storedUserData) {
              const userData = JSON.parse(storedUserData)
              if (userData && userData.id) {
                setUser(userData)
                setIsLoading(false)
                return
              }
            }
          } catch (e) {
            console.error("Failed to parse stored user data:", e)
          }

          // In a real app, verify the token with your backend
          try {
            const response = await fetch("/api/auth/verify", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (response.ok) {
              const userData = await response.json()
              setUser(userData)
              localStorage.setItem("user_data", JSON.stringify(userData))
            } else {
              // Token is invalid, remove it
              localStorage.removeItem("auth_token")
              localStorage.removeItem("user_data")
              setUser(null)
            }
          } catch (error) {
            console.error("Token verification failed:", error)
            // Keep the user logged in if we can't verify the token
            // This helps in preview environments where the API might not be available
            const storedUserData = localStorage.getItem("user_data")
            if (storedUserData) {
              try {
                const userData = JSON.parse(storedUserData)
                if (userData && userData.id) {
                  setUser(userData)
                }
              } catch (e) {
                console.error("Failed to parse stored user data:", e)
                setUser(null)
              }
            } else {
              setUser(null)
            }
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // For demo/preview purposes - allow login with demo credentials
    if (email === "demo@example.com" && password === "password123") {
      localStorage.setItem("auth_token", "mock-jwt-token")
      localStorage.setItem("user_data", JSON.stringify(MOCK_USER))
      setUser(MOCK_USER)
      setIsLoading(false)
      return true
    }

    try {
      // In a real app, this would be an API call to your backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response received:", await response.text())

        // Fallback to API that we know works in the preview environment
        try {
          const fallbackResponse = await fetch("/api/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json()
            localStorage.setItem("auth_token", data.token)
            localStorage.setItem("user_data", JSON.stringify(data.user))
            setUser(data.user)
            setIsLoading(false)
            return true
          }
        } catch (fallbackError) {
          console.error("Fallback auth failed:", fallbackError)
        }

        setIsLoading(false)
        return false
      }

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user_data", JSON.stringify(data.user))
        setUser(data.user)
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)

      // If we're in a preview environment, allow login with demo credentials
      if (email === "demo@example.com" && password === "password123") {
        localStorage.setItem("auth_token", "mock-jwt-token")
        localStorage.setItem("user_data", JSON.stringify(MOCK_USER))
        setUser(MOCK_USER)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // For demo purposes, let's implement a simple mock registration
      // This avoids API call issues in the demo environment
      const userData = {
        id: Date.now().toString(),
        name,
        email,
      }

      localStorage.setItem("auth_token", "mock-jwt-token")
      localStorage.setItem("user_data", JSON.stringify(userData))
      setUser(userData)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
    router.push("/login")
  }

  const checkAuth = async (): Promise<boolean> => {
    if (user) return true

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return false

      // Check if we have user data stored
      const storedUserData = localStorage.getItem("user_data")
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData)
          if (userData && userData.id) {
            setUser(userData)
            return true
          }
        } catch (e) {
          console.error("Failed to parse stored user data:", e)
        }
      }

      // In a real app, verify the token with your backend
      try {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          return true
        }
      } catch (error) {
        console.error("Token verification failed:", error)
        // In preview environments, consider the user authenticated if they have a token
        if (process.env.NODE_ENV !== "production") {
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Auth check failed:", error)
      return false
    }
  }

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      // In a real app, this would be an API call to update the user profile
      // For demo purposes, we'll just update the local state
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user_data", JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkAuth,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
