"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, MousePointer, MousePointerClick } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface ViewOnlyModeProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  onShowPointer?: (show: boolean) => void
  onPointerColorChange?: (color: string) => void
  onPointerSizeChange?: (size: number) => void
}

export function ViewOnlyMode({
  isEnabled,
  onToggle,
  onShowPointer,
  onPointerColorChange,
  onPointerSizeChange,
}: ViewOnlyModeProps) {
  const [showPointer, setShowPointer] = useState(true)
  const [pointerColor, setPointerColor] = useState("#FF3B30")
  const [pointerSize, setPointerSize] = useState(5)

  // Available pointer colors
  const pointerColors = [
    { name: "Red", value: "#FF3B30" },
    { name: "Green", value: "#34C759" },
    { name: "Blue", value: "#007AFF" },
    { name: "Yellow", value: "#FFCC00" },
    { name: "Purple", value: "#AF52DE" },
  ]

  useEffect(() => {
    // When view-only mode is disabled, reset pointer settings
    if (!isEnabled) {
      setShowPointer(true)
      setPointerColor("#FF3B30")
      setPointerSize(5)
    }
  }, [isEnabled])

  const handleShowPointerChange = (show: boolean) => {
    setShowPointer(show)
    if (onShowPointer) {
      onShowPointer(show)
    }
  }

  const handlePointerColorChange = (color: string) => {
    setPointerColor(color)
    if (onPointerColorChange) {
      onPointerColorChange(color)
    }
  }

  const handlePointerSizeChange = (value: number[]) => {
    const size = value[0]
    setPointerSize(size)
    if (onPointerSizeChange) {
      onPointerSizeChange(size)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          <Label htmlFor="view-only-mode">View-Only Mode</Label>
        </div>
        <Switch id="view-only-mode" checked={isEnabled} onCheckedChange={onToggle} />
      </div>

      {isEnabled && (
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            In view-only mode, you can see the remote screen but cannot control it with your keyboard or mouse.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              <Label htmlFor="show-pointer">Show Remote Pointer</Label>
            </div>
            <Switch id="show-pointer" checked={showPointer} onCheckedChange={handleShowPointerChange} />
          </div>

          {showPointer && (
            <>
              <div className="space-y-2">
                <Label>Pointer Color</Label>
                <div className="flex gap-2">
                  {pointerColors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-6 h-6 rounded-full border ${pointerColor === color.value ? "border-primary ring-2 ring-primary/30" : "border-muted-foreground/30"}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handlePointerColorChange(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pointer-size">Pointer Size</Label>
                  <span className="text-sm text-muted-foreground">{pointerSize}</span>
                </div>
                <Slider
                  id="pointer-size"
                  min={3}
                  max={10}
                  step={1}
                  value={[pointerSize]}
                  onValueChange={handlePointerSizeChange}
                />
              </div>

              <div className="border rounded-md p-3 flex items-center justify-center bg-muted/30">
                <div className="relative">
                  <MousePointerClick className="h-8 w-8 text-muted-foreground" />
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: `${pointerSize * 2}px`,
                      height: `${pointerSize * 2}px`,
                      backgroundColor: pointerColor,
                      opacity: 0.7,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
