"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/dashboard"
  const { login, isAuthenticated, completeLogin } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'login' | 'mfa'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [success, setSuccess] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [qrError, setQrError] = useState<string | null>(null)

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      router.push(redirectPath)
    }
  }, [isAuthenticated, redirectPath, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        setStep('mfa')
      } else {
        setError("Invalid email or password. Try demo@example.com / password123")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Try demo@example.com / password123")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('https://localhost:5000/api/mfa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ code }),
    })
    const data = await res.json()
    if (data.success) {
      completeLogin({ id: "1", name: "Demo User", email: "demo@example.com" })
      setSuccess(true)
      setError('')
      router.push(redirectPath)
    } else {
      setError(data.error || 'Invalid code')
    }
  }

  async function fetchQrCode() {
    setQrError(null)
    setQrUrl(null)
    try {
      const res = await fetch('https://localhost:5000/api/mfa/setup', { method: 'POST', mode: 'cors' })
      if (!res.ok) {
        setQrError('Failed to fetch QR code.')
        console.error('QR code fetch failed:', res.status, await res.text())
        return
      }
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.startsWith('image/')) {
        setQrError('Server did not return an image.')
        console.error('QR code fetch did not return image:', contentType, await res.text())
        return
      }
      const blob = await res.blob()
      setQrUrl(URL.createObjectURL(blob))
    } catch (err) {
      setQrError('An error occurred while fetching the QR code.')
      console.error('QR code fetch error:', err)
    }
  }

  if (success) {
    return <div>Login successful! (MFA passed)</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-4 bg-muted/40">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Log in</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {step === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>
              </form>
            )}
            {step === 'mfa' && (
              <>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">MFA Code</Label>
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      placeholder="Enter your MFA code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify"}
                  </Button>
                </form>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button onClick={fetchQrCode} style={{ marginBottom: 8 }}>Show QR Code for Authenticator App</button>
                  {qrError && <div style={{ color: 'red', marginTop: 8 }}>{qrError}</div>}
                  {qrUrl && (
                    <div>
                      <img src={qrUrl} alt="MFA QR Code" style={{ width: 200, height: 200, margin: 'auto' }} />
                      <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Scan this QR code with your authenticator app</div>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">For demo purposes, you can use:</p>
              <p className="font-medium">
                Email: demo@example.com
                <br />
                Password: password123
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
