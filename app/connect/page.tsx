"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MonitorSelector } from "@/components/monitor-selector"
import { PermissionProfiles } from "@/components/permission-profiles"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { ProtectedRoute } from "@/components/protected-route"
import { ArrowLeft, Monitor, Share2, Copy, Clock, Info } from "lucide-react"

export default function ConnectPage() {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const router = useRouter()
  const [accessCode, setAccessCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("")
  const [selectedMonitor, setSelectedMonitor] = useState("")
  const [codeExpiryTime, setCodeExpiryTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState("")

  // Timer for code expiration countdown
  useEffect(() => {
    if (!codeExpiryTime) return

    const updateTimeRemaining = () => {
      const now = new Date()
      const diff = codeExpiryTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining("Expired")
        setGeneratedCode("")
        setCodeExpiryTime(null)
        addNotification({
          type: "warning",
          title: "Code Expired",
          message: "Your connection code has expired. Please generate a new one.",
          duration: 5000,
        })
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    // Update immediately
    updateTimeRemaining()

    // Then set up interval
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [codeExpiryTime, addNotification])

  const generateAccessCode = async () => {
    if (!selectedMonitor) {
      addNotification({
        type: "warning",
        title: "Monitor Required",
        message: "Please select a monitor to share before generating an access code.",
        duration: 4000,
      })
      return
    }

    setIsGenerating(true)
    setConnectionStatus("Generating secure connection code...")

    try {
      // In a real implementation, this would call your API
      // For demo purposes, simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random 9-character code
      const code = Math.random().toString(36).substring(2, 11).toUpperCase()
      setGeneratedCode(code)

      // Set expiry time (10 minutes from now)
      const expiryTime = new Date()
      expiryTime.setMinutes(expiryTime.getMinutes() + 10)
      setCodeExpiryTime(expiryTime)

      setConnectionStatus("Waiting for connection...")

      addNotification({
        type: "success",
        title: "Code Generated",
        message: "Your access code has been generated and is valid for 10 minutes.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error generating code:", error)
      setConnectionStatus("Failed to generate code. Please try again.")
      addNotification({
        type: "error",
        title: "Generation Failed",
        message: "Failed to generate a connection code. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const connectToRemote = async () => {
    if (!accessCode) {
      addNotification({
        type: "error",
        title: "Code Required",
        message: "Please enter an access code to connect.",
        duration: 4000,
      })
      return
    }

    setIsConnecting(true)
    setConnectionStatus("Validating connection code...")

    try {
      // For demo purposes, simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful connection
      setConnectionStatus("Connection established! Redirecting to remote control interface...")

      addNotification({
        type: "success",
        title: "Connection Established",
        message: "You are now connected to the remote device.",
        duration: 3000,
      })

      // Redirect to the remote control interface
      setTimeout(() => {
        router.push(`/remote-session?code=${accessCode}`)
      }, 1000)
    } catch (error) {
      console.error("Connection error:", error)
      setConnectionStatus("Connection failed. Invalid or expired code.")
      setIsConnecting(false)

      addNotification({
        type: "error",
        title: "Connection Failed",
        message: error instanceof Error ? error.message : "Failed to connect. Please check the code and try again.",
        duration: 5000,
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)

    addNotification({
      type: "info",
      title: "Copied to Clipboard",
      message: "The access code has been copied to your clipboard.",
      duration: 3000,
    })
  }

  const handleMonitorSelected = (monitorId: string) => {
    setSelectedMonitor(monitorId)
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 bg-gradient-to-b from-background to-background/80">
          <div className="container px-4 md:px-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold tracking-tighter">Remote Connection</h1>
            </div>

            <div className="mx-auto max-w-3xl">
              <Tabs defaultValue="connect" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="connect">
                    <Monitor className="mr-2 h-4 w-4" />
                    Connect to Remote
                  </TabsTrigger>
                  <TabsTrigger value="share">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Your Screen
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="connect" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Connect to a Remote Device</CardTitle>
                      <CardDescription>Enter the access code provided by the remote device</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter access code"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                            className="font-mono text-center text-lg"
                            maxLength={9}
                          />
                        </div>
                        <Button onClick={connectToRemote} disabled={!accessCode || isConnecting} className="w-full">
                          {isConnecting ? "Connecting..." : "Connect"}
                        </Button>

                        {connectionStatus && (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>{connectionStatus}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>
                          By connecting, you'll be able to view and control the remote device based on the permissions
                          granted by the host.
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="share" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Share Your Screen</CardTitle>
                      <CardDescription>
                        Generate a secure access code and share it with the person who needs to connect
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {!generatedCode ? (
                          <>
                            <MonitorSelector onMonitorSelected={handleMonitorSelected} />

                            <PermissionProfiles />

                            <Button
                              onClick={generateAccessCode}
                              className="w-full"
                              disabled={isGenerating || !selectedMonitor}
                            >
                              {isGenerating ? "Generating..." : "Generate Access Code"}
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-3xl font-mono font-bold tracking-wider bg-muted p-4 rounded-md border text-foreground">
                                {generatedCode.match(/.{1,3}/g)?.join("-")}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Expires in: {timeRemaining}</span>
                              </div>
                            </div>
                            <Button variant="outline" onClick={copyToClipboard} className="w-full">
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Code
                            </Button>

                            {connectionStatus && (
                              <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>{connectionStatus}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    {generatedCode && (
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setGeneratedCode("")}>
                          Generate New Code
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Need help? Check out our{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/how-it-works")}>
                    how it works guide
                  </Button>{" "}
                  or{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/support")}>
                    contact support
                  </Button>
                  .
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
