"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { EyeOff, Eye } from "lucide-react"

interface PrivacyModeProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  onBlurLevelChange?: (level: number) => void
}

export function PrivacyMode({ isEnabled, onToggle, onBlurLevelChange }: PrivacyModeProps) {
  const [blurLevel, setBlurLevel] = useState(5)

  const handleBlurLevelChange = (value: number[]) => {
    const level = value[0]
    setBlurLevel(level)
    if (onBlurLevelChange) {
      onBlurLevelChange(level)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEnabled ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          <Label htmlFor="privacy-mode">Privacy Mode</Label>
        </div>
        <Switch id="privacy-mode" checked={isEnabled} onCheckedChange={onToggle} />
      </div>

      {isEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="blur-level">Blur Level</Label>
            <span className="text-sm text-muted-foreground">{blurLevel}</span>
          </div>
          <Slider id="blur-level" min={1} max={10} step={1} value={[blurLevel]} onValueChange={handleBlurLevelChange} />
          <p className="text-xs text-muted-foreground">
            Higher values provide more privacy but may make text unreadable.
          </p>
        </div>
      )}

      <div className="pt-2">
        <Button variant={isEnabled ? "default" : "outline"} className="w-full" onClick={() => onToggle(!isEnabled)}>
          {isEnabled ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Disable Privacy Mode
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Enable Privacy Mode
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
