"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Monitor, Laptop, ComputerIcon as Desktop, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNotification } from "@/contexts/notification-context"

interface MonitorSelectorProps {
  onMonitorSelected: (monitorId: string) => void
}

export function MonitorSelector({ onMonitorSelected }: MonitorSelectorProps) {
  const [monitors, setMonitors] = useState<MediaDeviceInfo[]>([])
  const [selectedMonitor, setSelectedMonitor] = useState("entire-screen")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasScanned, setHasScanned] = useState(false)
  const { addNotification } = useNotification()

  // Call onMonitorSelected with the default value
  useEffect(() => {
    onMonitorSelected(selectedMonitor)
  }, [onMonitorSelected])

  const scanForMonitors = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error("Media devices API not supported in this browser")
      }

      // We don't need to call getDisplayMedia here, just enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")

      setMonitors(videoDevices)
      setHasScanned(true)

      if (videoDevices.length === 0) {
        setError("No video devices detected. You may need to connect a camera or webcam.")
      } else {
        addNotification({
          type: "success",
          title: "Devices Found",
          message: `Found ${videoDevices.length} video devices`,
          duration: 3000,
        })
      }
    } catch (err) {
      console.error("Error scanning for monitors:", err)
      setError(`Failed to scan for monitors: ${err instanceof Error ? err.message : "Unknown error"}`)

      addNotification({
        type: "error",
        title: "Scan Failed",
        message: "Failed to scan for monitors. Please check permissions.",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMonitorChange = (value: string) => {
    setSelectedMonitor(value)
    onMonitorSelected(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Select Screen to Share</Label>
        <Button variant="outline" size="sm" onClick={scanForMonitors} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan for Monitors
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <RadioGroup value={selectedMonitor} onValueChange={handleMonitorChange} className="grid grid-cols-1 gap-2">
        <div className="flex items-center space-x-2 rounded-md border p-3">
          <RadioGroupItem value="entire-screen" id="entire-screen" />
          <Label htmlFor="entire-screen" className="flex items-center cursor-pointer">
            <Monitor className="h-5 w-5 mr-2" />
            <div>
              <div className="font-medium">Entire Screen</div>
              <div className="text-xs text-muted-foreground">Share your entire screen</div>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 rounded-md border p-3">
          <RadioGroupItem value="application" id="application" />
          <Label htmlFor="application" className="flex items-center cursor-pointer">
            <Desktop className="h-5 w-5 mr-2" />
            <div>
              <div className="font-medium">Application Window</div>
              <div className="text-xs text-muted-foreground">Share a specific application window</div>
            </div>
          </Label>
        </div>

        {hasScanned && monitors.length > 0 && (
          <>
            <div className="text-sm font-medium mt-2">Available Monitors</div>
            {monitors.map((monitor, index) => (
              <div key={monitor.deviceId || index} className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem
                  value={monitor.deviceId || `monitor-${index}`}
                  id={monitor.deviceId || `monitor-${index}`}
                />
                <Label htmlFor={monitor.deviceId || `monitor-${index}`} className="flex items-center cursor-pointer">
                  <Laptop className="h-5 w-5 mr-2" />
                  <div>
                    <div className="font-medium">{monitor.label || `Monitor ${index + 1}`}</div>
                    <div className="text-xs text-muted-foreground">
                      Device ID: {monitor.deviceId.substring(0, 8)}...
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </>
        )}
      </RadioGroup>

      <div className="text-sm text-muted-foreground">
        <p>
          Note: The actual screen selection will happen when you start the session. Your browser will show a screen
          selection dialog at that time.
        </p>
      </div>
    </div>
  )
}
