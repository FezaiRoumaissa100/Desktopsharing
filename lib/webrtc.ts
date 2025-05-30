import { socketManager } from "./socket"

interface PeerConnectionConfig {
  sessionId: string
  role: "host" | "client"
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void
  onTrack?: (track: MediaStreamTrack, streams: readonly MediaStream[]) => void
  onDataChannel?: (channel: RTCDataChannel) => void
  onConnected?: () => void
  // onWhiteboardData?: (data: any) => void
  // onChatMessage?: (message: string, isRemote: boolean) => void
  // onFileReceive?: (data: any) => void
  // onSystemInfo?: (info: any) => void
  // onPrivacyModeChange?: (enabled: boolean) => void
}

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null
  private dataChannels: Map<string, RTCDataChannel> = new Map()
  private sessionId: string
  private role: "host" | "client"
  private config: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      // In a production environment, you would add TURN servers here
    ],
  }
  private onConnectionStateChange?: (state: RTCPeerConnectionState) => void
  private onTrack?: (track: MediaStreamTrack, streams: readonly MediaStream[]) => void
  private onDataChannel?: (channel: RTCDataChannel) => void
  public onConnected?: () => void
  // public onWhiteboardData?: (data: any) => void
  // public onChatMessage?: (message: string, isRemote: boolean) => void
  // public onFileReceive?: (data: any) => void
  // public onSystemInfo?: (info: any) => void
  // public onPrivacyModeChange?: (enabled: boolean) => void

  constructor(config: PeerConnectionConfig) {
    this.sessionId = config.sessionId
    this.role = config.role
    this.onConnectionStateChange = config.onConnectionStateChange
    this.onTrack = config.onTrack
    this.onDataChannel = config.onDataChannel
    this.onConnected = config.onConnected
    // this.onWhiteboardData = config.onWhiteboardData
    // this.onChatMessage = config.onChatMessage
    // this.onFileReceive = config.onFileReceive
    // this.onSystemInfo = config.onSystemInfo
    // this.onPrivacyModeChange = config.onPrivacyModeChange

    // Register with signaling server
    socketManager.connect()
    socketManager.registerSession(this.sessionId, this.role)

    // Set up signaling handlers
    socketManager.onSignalingMessage("offer", this.handleOffer.bind(this))
    socketManager.onSignalingMessage("answer", this.handleAnswer.bind(this))
    socketManager.onSignalingMessage("ice-candidate", this.handleIceCandidate.bind(this))

    // Initialize peer connection
    this.initPeerConnection()
  }

  private initPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.config)

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketManager.sendSignalingMessage("ice-candidate", this.sessionId, event.candidate)
      }
    }

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log("Connection state:", this.peerConnection.connectionState)
        this.onConnectionStateChange?.(this.peerConnection.connectionState)

        if (this.peerConnection.connectionState === "connected") {
          this.onConnected?.()
        }
      }
    }

    this.peerConnection.ontrack = (event) => {
      console.log("Received remote track", event.track.kind)
      this.onTrack?.(event.track, event.streams)
    }

    if (this.role === "host") {
      // Create data channels for different purposes
      this.createDataChannel("control", { ordered: true })
      // this.createDataChannel("clipboard", { ordered: true })
      // this.createDataChannel("file", { ordered: true, maxRetransmits: 30 })
      this.createDataChannel("chat", { ordered: true })
      // this.createDataChannel("whiteboard", { ordered: true, maxPacketLifeTime: 5000 })
    } else {
      // Client listens for data channels
      this.peerConnection.ondatachannel = (event) => {
        console.log("Received data channel:", event.channel.label)
        this.setupDataChannel(event.channel)
        this.dataChannels.set(event.channel.label, event.channel)

        if (event.channel.label === "control") {
          this.onDataChannel?.(event.channel)
        }
      }
    }
  }

  private createDataChannel(label: string, options: RTCDataChannelInit) {
    if (!this.peerConnection) return null

    try {
      const channel = this.peerConnection.createDataChannel(label, options)
      this.setupDataChannel(channel)
      this.dataChannels.set(label, channel)
      return channel
    } catch (error) {
      console.error(`Error creating ${label} data channel:`, error)
      return null
    }
  }

  private setupDataChannel(channel: RTCDataChannel) {
    channel.onopen = () => {
      console.log(`Data channel ${channel.label} opened`)
    }

    channel.onclose = () => {
      console.log(`Data channel ${channel.label} closed`)
    }

    channel.onerror = (error) => {
      console.error(`Data channel ${channel.label} error:`, error)
    }

    channel.onmessage = (event) => {
      console.log(`Data channel ${channel.label} message received`)
      // Individual message handling is done by the VNC client/host
    }
  }

  async createOffer() {
    if (!this.peerConnection) return

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      await this.peerConnection.setLocalDescription(offer)
      socketManager.sendSignalingMessage("offer", this.sessionId, offer)
    } catch (error) {
      console.error("Error creating offer:", error)
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      socketManager.sendSignalingMessage("answer", this.sessionId, answer)
    } catch (error) {
      console.error("Error handling offer:", error)
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
      console.error("Error handling answer:", error)
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error("Error adding ICE candidate:", error)
    }
  }

  async addScreenTrack(stream: MediaStream) {
    if (!this.peerConnection) return

    stream.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, stream)
    })
  }

  sendControlMessage(message: any) {
    this.sendDataChannelMessage("control", message)
  }

  // sendClipboardMessage(message: any) {
  //   this.sendDataChannelMessage("clipboard", message)
  // }

  // sendFileMessage(message: any) {
  //   this.sendDataChannelMessage("file", message)
  // }

  sendChatMessage(message: any) {
    this.sendDataChannelMessage("chat", message)
  }

  // sendWhiteboardMessage(message: any) {
  //   this.sendDataChannelMessage("whiteboard", message)
  // }

  private sendDataChannelMessage(channelName: string, message: any) {
    const channel = this.dataChannels.get(channelName)
    if (channel && channel.readyState === "open") {
      try {
        channel.send(JSON.stringify(message))
      } catch (error) {
        console.error(`Error sending message on ${channelName} channel:`, error)
      }
    } else {
      console.warn(`Cannot send message: ${channelName} channel not open`)
    }
  }

  getDataChannel(name: string): RTCDataChannel | undefined {
    return this.dataChannels.get(name)
  }

  close() {
    // Close all data channels
    this.dataChannels.forEach((channel) => {
      channel.close()
    })
    this.dataChannels.clear()

    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    // Clean up signaling handlers
    socketManager.removeSignalingHandler("offer")
    socketManager.removeSignalingHandler("answer")
    socketManager.removeSignalingHandler("ice-candidate")
  }
}
