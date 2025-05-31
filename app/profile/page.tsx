"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { ProtectedRoute } from "@/components/protected-route"
import { User, Shield, History, Trash, Upload, Monitor, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const { user, logout, updateUserProfile } = useAuth()
  const { addNotification } = useNotification()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [recentConnections, setRecentConnections] = useState<any[]>([])
  const [isLoadingConnections, setIsLoadingConnections] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }

    // Check for tab parameter in URL
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get("tab")
    if (tabParam && ["profile", "security", "connections"].includes(tabParam)) {
      // Set the active tab based on URL parameter
      const tabsElement = document.querySelector(`[data-state="active"][data-value="${tabParam}"]`)
      if (!tabsElement) {
        // If tab isn't already active, click it
        const tabTrigger = document.querySelector(`[data-radix-collection-item][value="${tabParam}"]`)
        if (tabTrigger) {
          ;(tabTrigger as HTMLElement).click()
        }
      }
    }

    // Fetch recent connections
    const fetchConnections = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRecentConnections([
          {
            id: "123-456-789",
            name: "Office Desktop",
            lastConnected: "2023-05-01T10:30:00Z",
          },
          {
            id: "987-654-321",
            name: "Home Laptop",
            lastConnected: "2023-04-28T18:45:00Z",
          },
        ])
      } catch (error) {
        console.error("Error fetching connections:", error)
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load connection history",
          duration: 5000,
        })
      } finally {
        setIsLoadingConnections(false)
      }
    }

    fetchConnections()
  }, [user, addNotification])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user profile in context
      updateUserProfile({ name, email })

      addNotification({
        type: "success",
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      addNotification({
        type: "error",
        title: "Update Failed",
        message: "Failed to update profile. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      addNotification({
        type: "error",
        title: "Password Mismatch",
        message: "New password and confirmation do not match.",
        duration: 5000,
      })
      return
    }

    setIsChangingPassword(true)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addNotification({
        type: "success",
        title: "Password Changed",
        message: "Your password has been updated successfully.",
        duration: 5000,
      })

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error changing password:", error)
      addNotification({
        type: "error",
        title: "Password Change Failed",
        message: "Failed to change password. Please check your current password and try again.",
        duration: 5000,
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Log out the user
      logout()

      addNotification({
        type: "info",
        title: "Account Deleted",
        message: "Your account has been deleted successfully.",
        duration: 5000,
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      addNotification({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete account. Please try again.",
        duration: 5000,
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background text-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold tracking-tighter">Your Profile</h1>
            </div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="connections">
                    <History className="mr-2 h-4 w-4" />
                    Connection History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your account details and personal information</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Your email"
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Update Profile"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Upload a new profile picture</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center space-y-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-muted">
                          <Image
                            src="/placeholder.svg?height=128&width=128"
                            alt="Profile picture"
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        </div>
                        <Button variant="outline" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload New Picture
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>Manage how you receive notifications</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive email notifications about your account and connections
                            </p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="security-alerts">Security Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about security events and suspicious activities
                            </p>
                          </div>
                          <Switch id="security-alerts" checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="security">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                              id="current-password"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Enter current password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isChangingPassword}>
                            {isChangingPassword ? "Changing Password..." : "Change Password"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>Manage your account security settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Login Sessions</h3>
                          <p className="text-sm text-muted-foreground">You are currently logged in from 1 device</p>
                          <Button variant="outline" size="sm">
                            Log Out All Devices
                          </Button>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Account Deletion</h3>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data
                          </p>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Account
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="connections">
                  <Card>
                    <CardHeader>
                      <CardTitle>Connection History</CardTitle>
                      <CardDescription>View your recent remote connections</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingConnections ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Loading connection history...</p>
                        </div>
                      ) : recentConnections.length > 0 ? (
                        <div className="space-y-4">
                          {recentConnections.map((connection) => (
                            <div
                              key={connection.id}
                              className="flex items-center justify-between rounded-lg border p-4"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-muted">
                                  <Monitor className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="font-medium">{connection.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Connected: {formatDate(connection.lastConnected)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">ID: {connection.id}</div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  router.push(`/connection-details/${connection.id}`)
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No connection history found.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer />

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}
