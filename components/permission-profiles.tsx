"use client"

import { useState } from "react"
import {
  type PermissionProfile,
  type RemoteControlPermissions,
  builtInProfiles,
  createCustomProfile,
} from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Plus, Trash2 } from "lucide-react"

interface PermissionProfilesProps {
  onProfileSelected: (profile: PermissionProfile) => void
  initialProfiles?: PermissionProfile[]
}

export function PermissionProfiles({ onProfileSelected, initialProfiles }: PermissionProfilesProps) {
  // Combine built-in profiles with any custom profiles
  const [profiles, setProfiles] = useState<PermissionProfile[]>(
    initialProfiles ||
      builtInProfiles.filter((profile) =>
        ["screen-sharing", "full-access"].includes(profile.id)
      )
  )
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || "")
  const [newProfileName, setNewProfileName] = useState("")
  const [baseProfileId, setBaseProfileId] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0]

  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId)
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      onProfileSelected(profile)
    }
  }

  const handlePermissionChange = (key: keyof RemoteControlPermissions, value: boolean) => {
    if (!selectedProfile || selectedProfile.isBuiltIn) return

    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === selectedProfile.id) {
        return {
          ...profile,
          permissions: {
            ...profile.permissions,
            [key]: value,
          },
        }
      }
      return profile
    })

    setProfiles(updatedProfiles)
    const updatedProfile = updatedProfiles.find((p) => p.id === selectedProfile.id)
    if (updatedProfile) {
      onProfileSelected(updatedProfile)
    }
  }

  const handleCreateProfile = () => {
    if (!newProfileName.trim() || !baseProfileId) return

    const baseProfile = profiles.find((p) => p.id === baseProfileId)
    if (!baseProfile) return

    const newProfile = createCustomProfile(newProfileName.trim(), baseProfile)
    const updatedProfiles = [...profiles, newProfile]

    setProfiles(updatedProfiles)
    setSelectedProfileId(newProfile.id)
    onProfileSelected(newProfile)
    setIsCreateDialogOpen(false)
    setNewProfileName("")
  }

  const handleDeleteProfile = (profileId: string) => {
    const profileToDelete = profiles.find((p) => p.id === profileId)
    if (!profileToDelete || profileToDelete.isBuiltIn) return

    const updatedProfiles = profiles.filter((p) => p.id !== profileId)
    setProfiles(updatedProfiles)

    // If the deleted profile was selected, select the default profile
    if (selectedProfileId === profileId) {
      setSelectedProfileId(profiles[0].id)
      onProfileSelected(profiles[0])
    }
  }

  const handleUnattendedAccessChange = (enabled: boolean) => {
    if (!selectedProfile || selectedProfile.isBuiltIn) return

    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === selectedProfile.id) {
        return {
          ...profile,
          isUnattendedAccess: enabled,
        }
      }
      return profile
    })

    setProfiles(updatedProfiles)
    const updatedProfile = updatedProfiles.find((p) => p.id === selectedProfile.id)
    if (updatedProfile) {
      onProfileSelected(updatedProfile)
    }
  }

  const handleUnattendedPasswordChange = (password: string) => {
    if (!selectedProfile || selectedProfile.isBuiltIn) return

    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === selectedProfile.id) {
        return {
          ...profile,
          unattendedPassword: password,
        }
      }
      return profile
    })

    setProfiles(updatedProfiles)
    const updatedProfile = updatedProfiles.find((p) => p.id === selectedProfile.id)
    if (updatedProfile) {
      onProfileSelected(updatedProfile)
    }
  }

  const handleProfileEnabledChange = (enabled: boolean) => {
    if (!selectedProfile || selectedProfile.isBuiltIn) return

    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === selectedProfile.id) {
        return {
          ...profile,
          isEnabled: enabled,
        }
      }
      return profile
    })

    setProfiles(updatedProfiles)
    const updatedProfile = updatedProfiles.find((p) => p.id === selectedProfile.id)
    if (updatedProfile) {
      onProfileSelected(updatedProfile)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="profile-select">Permission Profile</Label>
          <div className="flex items-center gap-2">
            <Select value={selectedProfileId} onValueChange={handleProfileChange}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name} {profile.isBuiltIn ? "(Built-in)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Profile</DialogTitle>
                  <DialogDescription>Create a new permission profile based on an existing one.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-profile-name">Profile Name</Label>
                    <Input
                      id="new-profile-name"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="My Custom Profile"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="base-profile">Base Profile</Label>
                    <Select value={baseProfileId} onValueChange={setBaseProfileId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a base profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProfile} disabled={!newProfileName.trim() || !baseProfileId}>
                    Create Profile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {selectedProfile && !selectedProfile.isBuiltIn && (
              <Button variant="outline" size="icon" onClick={() => handleDeleteProfile(selectedProfile.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {selectedProfile && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">{selectedProfile.description}</div>

          {!selectedProfile.isBuiltIn && (
            <>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="profile-enabled"
                    checked={selectedProfile.isEnabled}
                    onCheckedChange={(checked) => handleProfileEnabledChange(checked === true)}
                  />
                  <label
                    htmlFor="profile-enabled"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Profile Enabled
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unattended-access"
                    checked={selectedProfile.isUnattendedAccess}
                    onCheckedChange={(checked) => handleUnattendedAccessChange(checked === true)}
                  />
                  <label
                    htmlFor="unattended-access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable Unattended Access
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Unattended access allows connections without manual approval using a password.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {selectedProfile.isUnattendedAccess && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="unattended-password">Unattended Access Password</Label>
                  <Input
                    id="unattended-password"
                    type="password"
                    value={selectedProfile.unattendedPassword || ""}
                    onChange={(e) => handleUnattendedPasswordChange(e.target.value)}
                    placeholder="Enter a secure password"
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Other users are allowed to...</h3>
            <div className="space-y-2 border rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input controls */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-keyboard"
                    checked={selectedProfile.permissions.keyboard}
                    onCheckedChange={(checked) => handlePermissionChange("keyboard", checked === true)}
                    disabled={selectedProfile.isBuiltIn}
                  />
                  <label
                    htmlFor="perm-keyboard"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Control my keyboard and mouse
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-record-session"
                    checked={selectedProfile.permissions.recordSession}
                    onCheckedChange={(checked) => handlePermissionChange("recordSession", checked === true)}
                    disabled={selectedProfile.isBuiltIn}
                  />
                  <label
                    htmlFor="perm-record-session"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Record session
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-show-remote-pointer"
                    checked={selectedProfile.permissions.showRemotePointer}
                    onCheckedChange={(checked) => handlePermissionChange("showRemotePointer", checked === true)}
                    disabled={selectedProfile.isBuiltIn}
                  />
                  <label
                    htmlFor="perm-show-remote-pointer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show colored mouse pointer
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
