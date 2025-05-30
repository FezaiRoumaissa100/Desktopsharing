"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { ProtectedRoute } from "@/components/protected-route"
import { ArrowLeft, Monitor, Clock, User, Calendar, Shield } from "lucide-react"

export default function ConnectionDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [connection, setConnection] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConnectionDetails = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setConnection({
          id: id,
          name: "Office Desktop",
          lastConnected: "2023-05-01T10:30:00Z",
          duration: "45 minutes",
          user: "John Doe",
          permissions: ["Screen View", "Keyboard Control", "Mouse Control", "File Transfer"],
          ipAddress: "192.168.1.100",
          operatingSystem: "Windows 10",
          browser: "Chrome 112.0.5615.138",
        })
      } catch (error) {
        console.error("Error fetching connection details:", error)
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load connection details",
          duration: 5000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConnectionDetails()
  }, [id, addNotification])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 bg-hero-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold tracking-tighter">Connection Details</h1>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : connection ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Information</CardTitle>
                    <CardDescription>Details about this remote connection session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center p-4 bg-muted rounded-lg">
                      <Monitor className="h-12 w-12 text-primary mr-4" />
                      <div>
                        <h3 className="text-lg font-medium">{connection.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {connection.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          Date & Time
                        </p>
                        <p className="text-sm">{formatDate(connection.lastConnected)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Duration
                        </p>
                        <p className="text-sm">{connection.duration}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          Connected User
                        </p>
                        <p className="text-sm">{connection.user}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                          Permissions
                        </p>
                        <p className="text-sm">{connection.permissions.length} granted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Details</CardTitle>
                    <CardDescription>Technical information about this connection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <p className="text-sm font-medium">IP Address</p>
                        <p className="text-sm">{connection.ipAddress}</p>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <p className="text-sm font-medium">Operating System</p>
                        <p className="text-sm">{connection.operatingSystem}</p>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <p className="text-sm font-medium">Browser</p>
                        <p className="text-sm">{connection.browser}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                        Permissions Granted
                      </h3>
                      <ul className="space-y-1">
                        {connection.permissions.map((permission: string) => (
                          <li key={permission} className="text-sm flex items-center">
                            <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg font-medium">Connection not found</p>
                <p className="text-muted-foreground mt-2">
                  The connection details you're looking for could not be found.
                </p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
