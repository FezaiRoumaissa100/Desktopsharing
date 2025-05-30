export interface RemoteControlPermissions {
  // Input controls
  keyboard: boolean
  mouse: boolean
  lockLocalInput: boolean // Lock host's keyboard and mouse
  showRemotePointer: boolean // Show colored pointer for view-only mode

  // System access
  audio: boolean
  clipboard: boolean
  fileTransfer: boolean
  fileManager: boolean // Full file system access
  systemInfo: boolean // Access system information
  restart: boolean // Ability to restart the computer

  // Session features
  restrictedView: boolean // Limits view to specific applications
  recordSession: boolean
  remotePrint: boolean // Print remote documents locally
  whiteboard: boolean // Draw on screen
  tcpTunneling: boolean // Create TCP tunnels
  privacyMode: boolean // Enable privacy mode (blur/block screen)

  // Session behavior
  lockOnDisconnect: boolean // Lock account on session end
}

export interface PermissionProfile {
  id: string
  name: string
  description: string
  isEnabled: boolean
  isUnattendedAccess: boolean
  unattendedPassword?: string
  permissions: RemoteControlPermissions
  isBuiltIn: boolean
}

export const defaultPermissions: RemoteControlPermissions = {
  // Input controls
  keyboard: true,
  mouse: true,
  lockLocalInput: false,
  showRemotePointer: true,

  // System access
  audio: false,
  clipboard: true,
  fileTransfer: false,
  fileManager: false,
  systemInfo: false,
  restart: false,

  // Session features
  restrictedView: false,
  recordSession: false,
  remotePrint: false,
  whiteboard: false,
  tcpTunneling: false,
  privacyMode: false,

  // Session behavior
  lockOnDisconnect: false,
}

// Built-in permission profiles
export const builtInProfiles: PermissionProfile[] = [
  {
    id: "default",
    name: "Default",
    description: "Standard permissions with basic remote control",
    isEnabled: true,
    isUnattendedAccess: false,
    permissions: {
      ...defaultPermissions,
      keyboard: true,
      mouse: true,
      clipboard: true,
      audio: true,
      showRemotePointer: true,
      whiteboard: true,
    },
    isBuiltIn: true,
  },
  {
    id: "screen-sharing",
    name: "Screen Sharing",
    description: "View-only access with no control permissions",
    isEnabled: true,
    isUnattendedAccess: false,
    permissions: {
      ...defaultPermissions,
      keyboard: false,
      mouse: false,
      clipboard: false,
      audio: true,
      showRemotePointer: true,
      whiteboard: false,
      recordSession: true,
    },
    isBuiltIn: true,
  },
  {
    id: "full-access",
    name: "Full Access",
    description: "Complete control over the remote device",
    isEnabled: true,
    isUnattendedAccess: false,
    permissions: {
      // Input controls
      keyboard: true,
      mouse: true,
      lockLocalInput: false,
      showRemotePointer: true,

      // System access
      audio: false,
      clipboard: false,
      fileTransfer: false,
      fileManager: false,
      systemInfo: false,
      restart: false,

      // Session features
      restrictedView: false,
      recordSession: true,
      remotePrint: false,
      whiteboard: false,
      tcpTunneling: false,
      privacyMode: false,

      // Session behavior
      lockOnDisconnect: false,
    },
    isBuiltIn: true,
  },
]

export function serializePermissions(permissions: RemoteControlPermissions): string {
  return JSON.stringify(permissions)
}

export function deserializePermissions(serialized: string): RemoteControlPermissions {
  try {
    return JSON.parse(serialized)
  } catch (e) {
    return { ...defaultPermissions }
  }
}

export function serializeProfile(profile: PermissionProfile): string {
  return JSON.stringify(profile)
}

export function deserializeProfile(serialized: string): PermissionProfile | null {
  try {
    return JSON.parse(serialized)
  } catch (e) {
    return null
  }
}

// Helper to create a new custom profile
export function createCustomProfile(name: string, baseProfile: PermissionProfile): PermissionProfile {
  return {
    id: `custom-${Date.now()}`,
    name,
    description: `Custom profile based on ${baseProfile.name}`,
    isEnabled: true,
    isUnattendedAccess: false,
    permissions: { ...baseProfile.permissions },
    isBuiltIn: false,
  }
}
