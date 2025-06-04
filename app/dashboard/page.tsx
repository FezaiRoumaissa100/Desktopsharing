"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { ProtectedRoute } from "@/components/protected-route"
import { ArrowRight, Monitor, History, ExternalLink, User, Settings, Shield } from "lucide-react"

type Connection = {
  id: string
  name: string
  date: string
  duration: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const router = useRouter()
  const [recentConnections, setRecentConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockConnections = [
      {
        id: "1",
        name: "John's Computer",
        date: "2023-05-15 14:30",
        duration: "45 minutes",
      },
      {
        id: "2",
        name: "Marketing Laptop",
        date: "2023-05-14 10:15",
        duration: "1 hour 20 minutes",
      },
      {
        id: "3",
        name: "Support Desk",
        date: "2023-05-12 16:45",
        duration: "30 minutes",
      },
    ]

    // Simulate API call
    setTimeout(() => {
      setRecentConnections(mockConnections)
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-background text-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={() => router.push("/start-session")} className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Start New Connection
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Account Type:</span> Standard
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/profile")}>
                    Manage Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/start-session")}>
                      <Monitor className="mr-2 h-4 w-4" />
                      New Connection
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/profile?tab=connections")}
                    >
                      <History className="mr-2 h-4 w-4" />
                      Connection History
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/support")}>
                    Get Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/profile?tab=security")}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/profile?tab=permissions")}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Permission Profiles
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/how-it-works")}>
                    Learn About Security
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Recent Connections
                </CardTitle>
                <CardDescription>Your most recent remote connections</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : recentConnections.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Duration</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentConnections.map((connection) => (
                          <tr key={connection.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{connection.name}</td>
                            <td className="py-3 px-4">{connection.date}</td>
                            <td className="py-3 px-4">{connection.duration}</td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/connection-details/${connection.id}`)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No recent connections found. Start a new connection to see it here.
                    </p>
                  </div>
                )}
              </CardContent>
              {recentConnections.length > 0 && (
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/profile?tab=connections")}>
                    View All Connections
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
