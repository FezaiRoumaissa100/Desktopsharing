"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-xl font-bold text-primary">VNC Web</span>
            </Link>
            <nav className="hidden md:flex ml-8 space-x-6">
              <Link
                href="/"
                className={`text-sm ${
                  isActive("/") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/features"
                className={`text-sm ${
                  isActive("/features") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                }`}
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className={`text-sm ${
                  isActive("/how-it-works") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                }`}
                onClick={closeMenu}
              >
                How It Works
              </Link>
              <Link
                href="/support"
                className={`text-sm ${
                  isActive("/support") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                }`}
                onClick={closeMenu}
              >
                Support
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleMenu} className="flex items-center text-sm focus:outline-none">
                  <span className="mr-2 hidden sm:inline-block">{user?.name}</span>
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10 border border-border">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-muted" onClick={closeMenu}>
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted" onClick={closeMenu}>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        closeMenu()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-sm rounded-md hover:bg-muted" onClick={closeMenu}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base ${
              isActive("/") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="/features"
            className={`block px-3 py-2 rounded-md text-base ${
              isActive("/features") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
            onClick={closeMenu}
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className={`block px-3 py-2 rounded-md text-base ${
              isActive("/how-it-works") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
            onClick={closeMenu}
          >
            How It Works
          </Link>
          <Link
            href="/support"
            className={`block px-3 py-2 rounded-md text-base ${
              isActive("/support") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            }`}
            onClick={closeMenu}
          >
            Support
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className={`block px-3 py-2 rounded-md text-base ${
                  isActive("/dashboard") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                }`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={`block px-3 py-2 rounded-md text-base ${
                  isActive("/profile") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                }`}
                onClick={closeMenu}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout()
                  closeMenu()
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base hover:bg-muted"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
