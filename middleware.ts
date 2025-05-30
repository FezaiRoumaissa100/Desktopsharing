import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes that require authentication
const protectedRoutes = ["/connect", "/remote-session", "/dashboard", "/profile", "/connection-details"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (isProtectedRoute) {
    // Check for authentication token
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      // For local development, create a mock token if it doesn't exist
      if (process.env.NODE_ENV === "development") {
        const response = NextResponse.next()
        response.cookies.set("auth_token", "mock-token-for-development", {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
        return response
      }

      // Redirect to login page with return URL
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
