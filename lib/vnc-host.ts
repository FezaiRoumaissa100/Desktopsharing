import { WebRTCManager } from "./webrtc"
import { type RemoteControlPermissions, defaultPermissions } from "./permissions"

interface VNCHostConfig {
  sessionId: string
  permissions: RemoteControlPermissions
  onStatusChange: (status: string) => void
  onConnected: () => void
  onDisconnected: () => void
  onPermissionRequest?: (type: keyof RemoteControlPermissions) => void
  onChatMessage?: (message: string, isRemote: boolean) => void
}

export class VNCHost {
  private webrtc: WebRTCManager | null = null
  private sessionId: string
  private permissions: RemoteControlPermissions
  private connected = false
  private screenStream: MediaStream | null = null
  private onStatusChange: (status: string) => void
  private onConnected: () => void
  private onDisconnected: () => void
  private onPermissionRequest?: (type: keyof RemoteControlPermissions) => void
  private onChatMessage?: (message: string, isRemote: boolean) => void
  private monitors: MediaDeviceInfo[] = []
  private selectedMonitor: string | null = null

  constructor(config: VNCHostConfig) {
    this.sessionId = config.sessionId
    this.permissions = config.permissions || { ...defaultPermissions }
    this.onStatusChange = config.onStatusChange
    this.onConnected = config.onConnected
    this.onDisconnected = config.onDisconnected
    this.onPermissionRequest = config.onPermissionRequest
    this.onChatMessage = config.onChatMessage
  }

  async getAvailableMonitors(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      this.monitors = devices.filter((device) => device.kind === "videoinput")
      return this.monitors
    } catch (error) {
      console.error("Error getting available monitors:", error)
      return []
    }
  }

  async start(monitorId?: string) {
    this.onStatusChange("Starting screen sharing...")

    try {
      // Request screen sharing permission - this will always prompt the user
      // regardless of what was selected in the UI
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          cursor: "always",
          displaySurface: "monitor",
        },
        audio: this.permissions.audio,
      }

      // The monitorId is mostly informational at this point
      // The actual selection happens in the browser's screen sharing dialog
      this.selectedMonitor = monitorId || null

      // This will show the browser's built-in screen selection dialog
      this.screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)

      // Set up WebRTC connection
      this.webrtc = new WebRTCManager({
        sessionId: this.sessionId,
        role: "host",
        onConnectionStateChange: this.handleConnectionStateChange.bind(this),
        onDataChannel: this.handleDataChannel.bind(this),
        onConnected: () => {
          // Send permissions to the client when connected
          this.webrtc?.sendControlMessage({
            type: "permissions",
            permissions: this.permissions,
          })
        },
      })

      // Add screen track to peer connection
      await this.webrtc.addScreenTrack(this.screenStream)

      this.onStatusChange("Waiting for connection...")

      // Handle screen sharing being stopped by the user
      this.screenStream.getVideoTracks()[0].onended = () => {
        this.stop()
      }
    } catch (error) {
      console.error("Error starting screen sharing:", error)
      this.onStatusChange("Failed to start screen sharing")
      throw error // Re-throw to allow the UI to handle this
    }
  }

  private handleConnectionStateChange(state: RTCPeerConnectionState) {
    switch (state) {
      case "connected":
        this.connected = true
        this.onStatusChange("Connected to remote client")
        this.onConnected()
        break
      case "disconnected":
      case "failed":
      case "closed":
        this.connected = false
        this.onStatusChange("Disconnected from remote client")
        this.onDisconnected()
        break
    }
  }

  private handleDataChannel(channel: RTCDataChannel) {
    channel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        this.handleControlMessage(message)
      } catch (error) {
        console.error("Error parsing control message:", error)
      }
    }
  }

  private handleControlMessage(message: any) {
    // Check permissions before processing control messages
    switch (message.type) {
      case "mouse":
        if (this.permissions.mouse) {
          this.handleMouseControl(message)
        } else {
          this.notifyPermissionDenied("mouse")
        }
        break
      case "keyboard":
        if (this.permissions.keyboard) {
          this.handleKeyboardControl(message)
        } else {
          this.notifyPermissionDenied("keyboard")
        }
        break
      case "chat":
        this.handleChatMessage(message)
        break
      case "permission_request":
        // Client is requesting a permission that's currently denied
        if (this.onPermissionRequest) {
          this.onPermissionRequest(message.permission as keyof RemoteControlPermissions)
        }
        break
    }
  }

  private notifyPermissionDenied(permission: keyof RemoteControlPermissions) {
    this.webrtc?.sendControlMessage({
      type: "permission_denied",
      permission,
    })
  }

  private handleMouseControl(message: any) {
    // In a real implementation, this would simulate mouse events on the host system
    console.log("Mouse control:", message)

    // Example implementation using the browser's Automation API (not widely supported yet)
    // This is a placeholder for actual implementation
    if (message.action === "move" && "automationPointer" in navigator) {
      // @ts-ignore - TypeScript doesn't know about this experimental API
      navigator.automationPointer.move(message.x, message.y)
    } else if (message.action === "down" && "automationPointer" in navigator) {
      // @ts-ignore
      navigator.automationPointer.down({ button: message.button })
    } else if (message.action === "up" && "automationPointer" in navigator) {
      // @ts-ignore
      navigator.automationPointer.up({ button: message.button })
    } else if (message.action === "wheel") {
      // Simulate wheel event
      // This would require a native integration in a real implementation
    }
  }

  private handleKeyboardControl(message: any) {
    // In a real implementation, this would simulate keyboard events on the host system
    console.log("Keyboard control:", message)

    // Example implementation using the browser's Automation API (not widely supported yet)
    if (message.action === "down" && "automationKeyboard" in navigator) {
      // @ts-ignore
      navigator.automationKeyboard.down(message.key)
    } else if (message.action === "up" && "automationKeyboard" in navigator) {
      // @ts-ignore
      navigator.automationKeyboard.up(message.key)
    } else if (message.action === "special") {
      // Handle special key combinations
      console.log("Special key combination:", message.combination)
    }
  }

  sendChatMessage(text: string) {
    if (!this.connected) return

    this.webrtc?.sendControlMessage({
      type: "chat",
      action: "message",
      text,
    })

    if (this.onChatMessage) {
      this.onChatMessage(text, false)
    }

    // Add this line to trigger any global handlers
    if (window.receiveLocalMessage) {
      window.receiveLocalMessage(text)
    }
  }

  private handleChatMessage(message: any) {
    if (message.action === "message" && message.text) {
      console.log("Chat message received:", message.text)
      if (this.onChatMessage) {
        this.onChatMessage(message.text, true)
      }
    }
  }

  updatePermissions(permissions: Partial<RemoteControlPermissions>) {
    this.permissions = {
      ...this.permissions,
      ...permissions,
    }

    // Notify client of permission changes
    this.webrtc?.sendControlMessage({
      type: "permissions_update",
      permissions: this.permissions,
    })
  }

  enablePrivacyMode(enabled: boolean) {
    if (!this.connected || !this.permissions.privacyMode) return

    this.webrtc?.sendControlMessage({
      type: "privacy_mode",
      enabled,
    })
  }

  stop() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop())
      this.screenStream = null
    }

    if (this.webrtc) {
      this.webrtc.close()
      this.webrtc = null
    }

    this.connected = false
    this.onStatusChange("Stopped")
    this.onDisconnected()
  }
}
