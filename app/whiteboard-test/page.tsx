"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Whiteboard } from "@/components/whiteboard"
import { Footer } from "@/components/footer"

export default function WhiteboardTestPage() {
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false)
  const [screenDimensions, setScreenDimensions] = useState({ width: 800, height: 600 })

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background text-foreground">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Whiteboard Test</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Test the whiteboard functionality for the VNC platform
          </p>
          <Button onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}>
            {isWhiteboardActive ? "Disable Whiteboard" : "Enable Whiteboard"}
          </Button>
        </div>

        <div className="relative mx-auto border rounded-lg overflow-hidden" style={{ width: 800, height: 600 }}>
          {/* Placeholder for remote screen */}
          <div
            className="w-full h-full bg-gray-800"
            style={{
              backgroundImage: "url('/placeholder.svg?height=600&width=800')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Whiteboard overlay */}
          {isWhiteboardActive && (
            <Whiteboard
              isActive={isWhiteboardActive}
              onClose={() => setIsWhiteboardActive(false)}
              width={screenDimensions.width}
              height={screenDimensions.height}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
