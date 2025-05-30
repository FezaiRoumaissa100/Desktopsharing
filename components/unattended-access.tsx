"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Computer, Key, Lock, Shield, User, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UnattendedAccessProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  onSave?: (config: UnattendedAccessConfig) => void
}

interface UnattendedAccessConfig {
  enabled: boolean
  password: string
  allowedUsers: string[]
  scheduleEnabled: boolean
  scheduleStart: string
  scheduleEnd: string
  daysOfWeek: string[]
}

export function UnattendedAccess({ isEnabled, onToggle, onSave }: UnattendedAccessProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [allowedUsers, setAllowedUsers] = useState<string[]>([])
  const [newUser, setNewUser] = useState("")
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduleStart, setScheduleStart] = useState("09:00")
  const [scheduleEnd, setScheduleEnd] = useState("17:00")
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"])
  const [passwordError, setPasswordError] = useState("")

  const handleToggle = (enabled: boolean) => {
    if (enabled && !password) {
      setPasswordError("Password is required to enable unattended access")
      return
    }

    onToggle(enabled)

    if (enabled && onSave) {
      saveConfig()
    }
  }

  const handleAddUser = () => {
    if (!newUser.trim()) return

    setAllowedUsers([...allowedUsers, newUser.trim()])
    setNewUser("")
  }

  const handleRemoveUser = (user: string) => {
    setAllowedUsers(allowedUsers.filter((u) => u !== user))
  }

  const handleDayToggle = (day: string) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day))
    } else {
      setDaysOfWeek([...daysOfWeek, day])
    }
  }

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }

    setPasswordError("")
    return true
  }

  const saveConfig = () => {
    if (!validatePassword()) return

    const config: UnattendedAccessConfig = {
      enabled: isEnabled,
      password,
      allowedUsers,
      scheduleEnabled,
      scheduleStart,
      scheduleEnd,
      daysOfWeek,
    }

    if (onSave) {
      onSave(config)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Computer className="h-5 w-5" />
          <Label htmlFor="unattended-access">Unattended Access</Label>
        </div>
        <Switch id="unattended-access" checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && (
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="users">
              <User className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Clock className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Settings</CardTitle>
                <CardDescription>Configure security settings for unattended access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Access Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a secure password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Allowed Users</CardTitle>
                <CardDescription>Specify which users can access this device unattended</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email or username"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                  />
                  <Button onClick={handleAddUser} disabled={!newUser.trim()}>
                    Add
                  </Button>
                </div>

                <div className="border rounded-md divide-y">
                  {allowedUsers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No users added yet</div>
                  ) : (
                    allowedUsers.map((user) => (
                      <div key={user} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{user}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Access Schedule</CardTitle>
                <CardDescription>Set when unattended access is allowed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="schedule-enabled">Enable Schedule</Label>
                  <Switch id="schedule-enabled" checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
                </div>

                {scheduleEnabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={scheduleStart}
                          onChange={(e) => setScheduleStart(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={scheduleEnd}
                          onChange={(e) => setScheduleEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Days of Week</Label>
                      <div className="flex flex-wrap gap-2">
                        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                          <Button
                            key={day}
                            variant={daysOfWeek.includes(day) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleDayToggle(day)}
                            className="capitalize"
                          >
                            {day.substring(0, 3)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={saveConfig} className="w-full">
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!isEnabled && (
        <p className="text-sm text-muted-foreground">
          Enable unattended access to allow connections to this device without manual approval.
        </p>
      )}
    </div>
  )
}
