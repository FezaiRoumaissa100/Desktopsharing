interface Window {
  receiveRemoteMessage?: (message: string) => void
  receiveLocalMessage?: (message: string) => void
}
