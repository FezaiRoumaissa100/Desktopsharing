"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  MousePointerClick,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface MobileTouchControlsProps {
  isEnabled: boolean
  onTouchAction: (action: string, data?: any) => void
}

export function MobileTouchControls({ isEnabled, onTouchAction }: MobileTouchControlsProps) {
  const [touchMode, setTouchMode] = useState<"direct" | "trackpad" | "dpad">("direct")
  const [isZoomed, setIsZoomed] = useState(false)
  const trackpadRef = useRef<HTMLDivElement>(null)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    // Detect if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Default to trackpad mode on mobile
    if (isMobile) {
      setTouchMode("trackpad")
    }
  }, [])

  const handleTrackpadTouchStart = (e: React.TouchEvent) => {
    if (!isEnabled || touchMode !== "trackpad") return

    const touch = e.touches[0]
    setLastPosition({ x: touch.clientX, y: touch.clientY })
    setIsDragging(true)
  }

  const handleTrackpadTouchMove = (e: React.TouchEvent) => {
    if (!isEnabled || touchMode !== "trackpad" || !isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - lastPosition.x
    const deltaY = touch.clientY - lastPosition.y

    // Send mouse move event
    onTouchAction("mousemove", { deltaX, deltaY })

    setLastPosition({ x: touch.clientX, y: touch.clientY })
  }

  const handleTrackpadTouchEnd = () => {
    if (!isEnabled || touchMode !== "trackpad") return

    setIsDragging(false)
  }

  const handleTrackpadTap = (e: React.TouchEvent) => {
    if (!isEnabled || touchMode !== "trackpad") return

    // Prevent default to avoid zooming or other browser gestures
    e.preventDefault()

    // Check if it's a single tap (not part of a drag)
    if (!isDragging) {
      // Send mouse click event
      onTouchAction("mouseclick", { button: 0 }) // Left click
    }
  }

  const handleDPadButton = (direction: string) => {
    if (!isEnabled || touchMode !== "dpad") return

    // Send directional movement
    onTouchAction("dpad", { direction })
  }

  const handleMouseButton = (button: number) => {
    if (!isEnabled) return

    // Send mouse button click
    onTouchAction("mouseclick", { button })
  }

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed)
    onTouchAction("zoom", { isZoomed: !isZoomed })
  }

  const handleModeChange = (mode: "direct" | "trackpad" | "dpad") => {
    setTouchMode(mode)
  }

  if (!isEnabled) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-2 z-50">
      {/* Mode selector */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant={touchMode === "direct" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("direct")}
            className="rounded-l-md rounded-r-none"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant={touchMode === "trackpad" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("trackpad")}
            className="rounded-none"
          >
            <MousePointerClick className="h-4 w-4" />
          </Button>
          <Button
            variant={touchMode === "dpad" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("dpad")}
            className="rounded-r-md rounded-l-none"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls based on mode */}
      {touchMode === "direct" && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Direct touch mode - touch the screen to interact</p>
        </div>
      )}

      {touchMode === "trackpad" && (
        <div className="space-y-2">
          <div
            ref={trackpadRef}
            className="h-32 bg-muted/50 rounded-md border border-dashed border-muted-foreground/50 relative"
            onTouchStart={handleTrackpadTouchStart}
            onTouchMove={handleTrackpadTouchMove}
            onTouchEnd={handleTrackpadTouchEnd}
            onTouchCancel={handleTrackpadTouchEnd}
          >
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p>Trackpad</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleMouseButton(0)}>
                Left Click
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleMouseButton(2)}>
                Right Click
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handleZoomToggle}>
              {isZoomed ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {touchMode === "dpad" && (
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {/* Top row */}
          <div></div>
          <Button variant="outline" size="sm" onClick={() => handleDPadButton("up")}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div></div>

          {/* Middle row */}
          <Button variant="outline" size="sm" onClick={() => handleDPadButton("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMouseButton(0)}>
            Click
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDPadButton("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Bottom row */}
          <Button variant="outline" size="sm" onClick={() => handleMouseButton(2)}>
            Right
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDPadButton("down")}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomToggle}>
            {isZoomed ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )
}
