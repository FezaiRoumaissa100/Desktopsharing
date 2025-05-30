import { WebRTCManager } from "./webrtc"
import { type RemoteControlPermissions, defaultPermissions } from "./permissions"

interface VNCClientConfig {
  sessionId: string
  canvasElement: HTMLCanvasElement
  onStatusChange: (status: string) => void
  onConnected: () => void
  onDisconnected: () => void
  onPermissionsChange?: (permissions: RemoteControlPermissions) => void
  onWhiteboardData?: (data: any) => void
  onChatMessage?: (message: string, isRemote: boolean) => void
  onFileReceive?: (data: any) => void
  onSystemInfo?: (info: any) => void
  onPrivacyModeChange?: (enabled: boolean) => void
}

export class VNCClient {
  private webrtc: WebRTCManager | null = null
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null = null
  private sessionId: string
  private connected = false
  private permissions: RemoteControlPermissions = { ...defaultPermissions }
  private onStatusChange: (status: string) => void
  private onConnected: () => void
  private onDisconnected: () => void
  private onPermissionsChange?: (permissions: RemoteControlPermissions) => void
  private onWhiteboardData?: (data: any) => void
  private onChatMessage?: (message: string, isRemote: boolean) => void
  private onFileReceive?: (data: any) => void
  private onSystemInfo?: (info: any) => void
  private onPrivacyModeChange?: (enabled: boolean) => void
  private videoElement: HTMLVideoElement | null = null
  private receivingFile: { [key: string]: { data: ArrayBuffer[]; size: number; type: string } } = {}
  private quality = 80
  private isPrivacyModeEnabled = false

  constructor(config: VNCClientConfig) {
    this.sessionId = config.sessionId
    this.canvas = config.canvasElement
    this.onStatusChange = config.onStatusChange
    this.onConnected = config.onConnected
    this.onDisconnected = config.onDisconnected
    this.onPermissionsChange = config.onPermissionsChange
    this.onWhiteboardData = config.onWhiteboardData
    this.onChatMessage = config.onChatMessage
    this.onFileReceive = config.onFileReceive
    this.onSystemInfo = config.onSystemInfo
    this.onPrivacyModeChange = config.onPrivacyModeChange
    this.ctx = this.canvas.getContext("2d")

    // Create hidden video element to receive the stream
    this.videoElement = document.createElement("video")
    this.videoElement.style.display = "none"
    this.videoElement.autoplay = true
    this.videoElement.playsInline = true
    document.body.appendChild(this.videoElement)

    // Set up event listeners for user input
    this.setupInputListeners()
  }

  connect() {
    this.onStatusChange("Connecting to remote device...")

    this.webrtc = new WebRTCManager({
      sessionId: this.sessionId,
      role: "client",
      onConnectionStateChange: this.handleConnectionStateChange.bind(this),
      onTrack: this.handleTrack.bind(this),
      onDataChannel: this.handleDataChannel.bind(this),
    })

    // Create offer to initiate connection
    setTimeout(() => {
      this.webrtc?.createOffer()
    }, 1000)
  }

  private handleConnectionStateChange(state: RTCPeerConnectionState) {
    switch (state) {
      case "connected":
        this.connected = true
        this.onStatusChange("Connected to remote device")
        this.onConnected()
        break
      case "disconnected":
      case "failed":
      case "closed":
        this.connected = false
        this.onStatusChange("Disconnected from remote device")
        this.onDisconnected()
        break
    }
  }

  private handleTrack(track: MediaStreamTrack, streams: readonly MediaStream[]) {
    if (track.kind === "video" && this.videoElement && streams.length > 0) {
      this.videoElement.srcObject = streams[0]

      // Start rendering the video to canvas
      this.videoElement.onloadedmetadata = () => {
        this.videoElement?.play()
        this.startRendering()
      }
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
    switch (message.type) {
      case "permissions":
        // Initial permissions set by host
        this.permissions = message.permissions
        this.onPermissionsChange?.(this.permissions)
        break
      case "permissions_update":
        // Host updated permissions
        this.permissions = message.permissions
        this.onPermissionsChange?.(this.permissions)
        break
      case "permission_denied":
        // A specific action was denied
        this.onStatusChange(`Permission denied: ${message.permission}`)
        break
      case "clipboard":
        if (message.action === "update" && this.permissions.clipboard) {
          // Update local clipboard with remote content
          const text = message.text
          navigator.clipboard.writeText(text)
        }
        break
      case "whiteboard":
        // Handle whiteboard data from host
        if (this.permissions.whiteboard && this.onWhiteboardData) {
          this.onWhiteboardData(message)
        }
        break
      case "chat":
        if (message.action === "message" && message.text) {
          if (this.onChatMessage) {
            this.onChatMessage(message.text, true)
          }
        }
        break
      case "file":
        this.handleFileMessage(message)
        break
      case "system_info":
        if (this.onSystemInfo) {
          this.onSystemInfo(message.info)
        }
        break
      case "privacy_mode":
        this.isPrivacyModeEnabled = message.enabled
        if (this.onPrivacyModeChange) {
          this.onPrivacyModeChange(message.enabled)
        }
        break
    }
  }

  private handleFileMessage(message: any) {
    if (!this.permissions.fileTransfer) return

    if (message.action === "info") {
      // Initialize file receiving
      this.receivingFile[message.name] = {
        data: [],
        size: message.size,
        type: message.type,
      }

      // Notify UI
      if (this.onFileReceive) {
        this.onFileReceive({
          action: "start",
          name: message.name,
          size: message.size,
          type: message.type,
        })
      }
    } else if (message.action === "data") {
      // Append data chunk
      if (this.receivingFile[message.name]) {
        this.receivingFile[message.name].data.push(message.data)

        // Check if file is complete
        const totalReceived = this.receivingFile[message.name].data.reduce(
          (total, chunk) => total + chunk.byteLength,
          0,
        )

        if (totalReceived >= this.receivingFile[message.name].size) {
          // File is complete, combine chunks
          const fileData = new Blob(this.receivingFile[message.name].data, {
            type: this.receivingFile[message.name].type,
          })

          // Create file object
          const file = new File([fileData], message.name, { type: this.receivingFile[message.name].type })

          // Notify UI
          if (this.onFileReceive) {
            this.onFileReceive({
              action: "complete",
              name: message.name,
              file: file,
              url: URL.createObjectURL(file),
            })
          }

          // Clean up
          delete this.receivingFile[message.name]
        } else {
          // Update progress
          if (this.onFileReceive) {
            this.onFileReceive({
              action: "progress",
              name: message.name,
              received: totalReceived,
              total: this.receivingFile[message.name].size,
              progress: totalReceived / this.receivingFile[message.name].size,
            })
          }
        }
      }
    }
  }

  private startRendering() {
    const renderFrame = () => {
      if (this.ctx && this.videoElement && this.connected) {
        // Adjust canvas size to match video
        if (
          this.canvas.width !== this.videoElement.videoWidth ||
          this.canvas.height !== this.videoElement.videoHeight
        ) {
          this.canvas.width = this.videoElement.videoWidth
          this.canvas.height = this.videoElement.videoHeight
        }

        // Draw video frame to canvas
        this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height)

        // Apply privacy mode if enabled
        if (this.isPrivacyModeEnabled) {
          this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

          // Draw privacy message
          this.ctx.font = "24px Arial"
          this.ctx.fillStyle = "white"
          this.ctx.textAlign = "center"
          this.ctx.fillText("Privacy Mode Enabled", this.canvas.width / 2, this.canvas.height / 2)
        }
      }

      requestAnimationFrame(renderFrame)
    }

    renderFrame()
  }

  private setupInputListeners() {
    // Mouse events
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
    this.canvas.addEventListener("wheel", this.handleWheel.bind(this))
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault())

    // Keyboard events
    window.addEventListener("keydown", this.handleKeyDown.bind(this))
    window.addEventListener("keyup", this.handleKeyUp.bind(this))
  }

  private handleMouseDown(event: MouseEvent) {
    if (!this.connected || !this.permissions.mouse || this.isPrivacyModeEnabled) return

    event.preventDefault()
    const { x, y } = this.getRelativeCoordinates(event)
    this.sendControlMessage({
      type: "mouse",
      action: "down",
      button: event.button,
      x,
      y,
    })
  }

  private handleMouseUp(event: MouseEvent) {
    if (!this.connected || !this.permissions.mouse || this.isPrivacyModeEnabled) return

    event.preventDefault()
    const { x, y } = this.getRelativeCoordinates(event)
    this.sendControlMessage({
      type: "mouse",
      action: "up",
      button: event.button,
      x,
      y,
    })
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.connected || !this.permissions.mouse || this.isPrivacyModeEnabled) return

    const { x, y } = this.getRelativeCoordinates(event)
    this.sendControlMessage({
      type: "mouse",
      action: "move",
      x,
      y,
    })
  }

  private handleWheel(event: WheelEvent) {
    if (!this.connected || !this.permissions.mouse || this.isPrivacyModeEnabled) return

    event.preventDefault()
    this.sendControlMessage({
      type: "mouse",
      action: "wheel",
      deltaX: event.deltaX,
      deltaY: event.deltaY,
    })
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.connected || !this.permissions.keyboard || this.isPrivacyModeEnabled) return

    // Only process if the canvas is focused or a parent element is focused
    if (!this.isCanvasFocused()) return

    // Prevent default for certain key combinations to avoid browser shortcuts
    if (event.ctrlKey || event.altKey || event.metaKey) {
      event.preventDefault()
    }

    this.sendControlMessage({
      type: "keyboard",
      action: "down",
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
    })
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (!this.connected || !this.permissions.keyboard || this.isPrivacyModeEnabled) return

    // Only process if the canvas is focused or a parent element is focused
    if (!this.isCanvasFocused()) return

    this.sendControlMessage({
      type: "keyboard",
      action: "up",
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
    })
  }

  private isCanvasFocused(): boolean {
    const activeElement = document.activeElement
    return this.canvas === activeElement || this.canvas.contains(activeElement as Node)
  }

  private getRelativeCoordinates(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  sendControlMessage(message: any) {
    this.webrtc?.sendControlMessage(message)
  }

  requestPermission(permission: keyof RemoteControlPermissions) {
    if (!this.connected) return

    this.sendControlMessage({
      type: "permission_request",
      permission,
    })
  }

  syncClipboard() {
    if (!this.connected || !this.permissions.clipboard) {
      this.requestPermission("clipboard")
      return
    }

    // Request clipboard content from host
    this.sendControlMessage({
      type: "clipboard",
      action: "get",
    })
  }

  setClipboardText(text: string) {
    if (!this.connected || !this.permissions.clipboard) {
      this.requestPermission("clipboard")
      return
    }

    // Send clipboard content to host
    this.sendControlMessage({
      type: "clipboard",
      action: "set",
      text,
    })
  }

  transferFile(file: File) {
    if (!this.connected || !this.permissions.fileTransfer) {
      this.requestPermission("fileTransfer")
      return
    }

    // In a real implementation, this would chunk and transfer the file
    this.sendControlMessage({
      type: "file",
      action: "transfer",
      name: file.name,
      size: file.size,
      type: file.type,
    })
  }

  setQuality(quality: number) {
    this.quality = quality

    // Send quality setting to host
    this.sendControlMessage({
      type: "config",
      action: "setQuality",
      quality,
    })
  }

  sendSpecialKey(combination: string) {
    if (!this.connected || !this.permissions.keyboard) {
      this.requestPermission("keyboard")
      return
    }

    this.sendControlMessage({
      type: "keyboard",
      action: "special",
      combination,
    })
  }

  sendWhiteboardData(data: any) {
    if (!this.connected || !this.permissions.whiteboard) {
      this.requestPermission("whiteboard")
      return
    }

    this.webrtc?.sendWhiteboardMessage({
      type: "whiteboard",
      ...data,
    })
  }

  sendChatMessage(text: string) {
    if (!this.connected) return

    this.webrtc?.sendChatMessage({
      type: "chat",
      action: "message",
      text,
      timestamp: Date.now(),
    })

    if (this.onChatMessage) {
      this.onChatMessage(text, false)
    }

    // Add this line to trigger any global handlers
    if (window.receiveLocalMessage) {
      window.receiveLocalMessage(text)
    }
  }

  requestSystemInfo() {
    if (!this.connected || !this.permissions.systemInfo) {
      this.requestPermission("systemInfo")
      return
    }

    this.sendControlMessage({
      type: "system",
      action: "get",
    })
  }

  requestRestart() {
    if (!this.connected || !this.permissions.restart) {
      this.requestPermission("restart")
      return
    }

    this.sendControlMessage({
      type: "restart",
      action: "request",
    })
  }

  disconnect() {
    if (this.videoElement) {
      this.videoElement.pause()
      this.videoElement.srcObject = null
      this.videoElement.remove()
      this.videoElement = null
    }

    if (this.webrtc) {
      this.webrtc.close()
      this.webrtc = null
    }

    this.connected = false
    this.onStatusChange("Disconnected")
    this.onDisconnected()
  }
}
