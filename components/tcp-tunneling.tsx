"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, Plus, Trash2 } from "lucide-react"

interface Tunnel {
  id: string
  localPort: number
  remoteHost: string
  remotePort: number
  status: "connecting" | "active" | "error" | "closed"
}

interface TCPTunnelingProps {
  isEnabled: boolean
  onCreateTunnel?: (tunnel: Omit<Tunnel, "id" | "status">) => void
  onCloseTunnel?: (tunnelId: string) => void
}

export function TCPTunneling({ isEnabled, onCreateTunnel, onCloseTunnel }: TCPTunnelingProps) {
  const [tunnels, setTunnels] = useState<Tunnel[]>([])
  const [localPort, setLocalPort] = useState("")
  const [remoteHost, setRemoteHost] = useState("")
  const [remotePort, setRemotePort] = useState("")

  const handleCreateTunnel = () => {
    if (!localPort || !remoteHost || !remotePort) return

    const newTunnel: Tunnel = {
      id: Date.now().toString(),
      localPort: Number.parseInt(localPort),
      remoteHost,
      remotePort: Number.parseInt(remotePort),
      status: "connecting",
    }

    setTunnels([...tunnels, newTunnel])

    // Simulate tunnel connection
    setTimeout(() => {
      setTunnels((prev) => prev.map((t) => (t.id === newTunnel.id ? { ...t, status: "active" } : t)))
    }, 1500)

    // Call the callback if provided
    if (onCreateTunnel) {
      onCreateTunnel({
        localPort: newTunnel.localPort,
        remoteHost: newTunnel.remoteHost,
        remotePort: newTunnel.remotePort,
      })
    }

    // Reset form
    setLocalPort("")
    setRemoteHost("")
    setRemotePort("")
  }

  const handleCloseTunnel = (tunnelId: string) => {
    // Update status to closing
    setTunnels((prev) => prev.map((t) => (t.id === tunnelId ? { ...t, status: "closed" } : t)))

    // Remove after a delay
    setTimeout(() => {
      setTunnels((prev) => prev.filter((t) => t.id !== tunnelId))
    }, 500)

    // Call the callback if provided
    if (onCloseTunnel) {
      onCloseTunnel(tunnelId)
    }
  }

  if (!isEnabled) {
    return (
      <div className="p-4 text-center">
        <Network className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">TCP tunneling is not enabled for this session.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Create TCP Tunnel</CardTitle>
          <CardDescription>Create a secure tunnel from a local port to a remote service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="local-port">Local Port</Label>
                <Input
                  id="local-port"
                  placeholder="8080"
                  value={localPort}
                  onChange={(e) => setLocalPort(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remote-host">Remote Host</Label>
                <Input
                  id="remote-host"
                  placeholder="example.com"
                  value={remoteHost}
                  onChange={(e) => setRemoteHost(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remote-port">Remote Port</Label>
                <Input
                  id="remote-port"
                  placeholder="80"
                  value={remotePort}
                  onChange={(e) => setRemotePort(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateTunnel} disabled={!localPort || !remoteHost || !remotePort} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Tunnel
          </Button>
        </CardFooter>
      </Card>

      {tunnels.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Tunnels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tunnels.map((tunnel) => (
                <div key={tunnel.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tunnel.status === "active"
                          ? "bg-green-500"
                          : tunnel.status === "connecting"
                            ? "bg-yellow-500"
                            : tunnel.status === "error"
                              ? "bg-red-500"
                              : "bg-gray-500"
                      }`}
                    />
                    <span className="font-mono text-sm">
                      localhost:{tunnel.localPort} → {tunnel.remoteHost}:{tunnel.remotePort}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCloseTunnel(tunnel.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
