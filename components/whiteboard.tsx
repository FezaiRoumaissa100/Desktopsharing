"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Eraser, Pencil, Trash2, X } from "lucide-react"

interface WhiteboardProps {
  isActive: boolean
  onClose: () => void
  width: number
  height: number
  onDrawPath?: (path: any) => void
  onClear?: () => void
  remoteDrawing?: any
}

type DrawingMode = "pen" | "eraser"
type DrawingPoint = { x: number; y: number; width: number; color: string; mode: DrawingMode }
type DrawingPath = DrawingPoint[]

export function Whiteboard({ isActive, onClose, width, height, onDrawPath, onClear, remoteDrawing }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("pen")
  const [penColor, setPenColor] = useState("#FF3B30")
  const [penWidth, setPenWidth] = useState(3)
  const [paths, setPaths] = useState<DrawingPath[]>([])
  const [currentPath, setCurrentPath] = useState<DrawingPath>([])

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !isActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas and set dimensions
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Redraw all paths
    drawPaths(ctx, paths)
  }, [isActive, width, height, paths])

  // Handle remote drawing
  useEffect(() => {
    if (!canvasRef.current || !isActive || !remoteDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (remoteDrawing.action === "draw" && remoteDrawing.path) {
      // Add remote path to paths
      setPaths((prev) => [...prev, remoteDrawing.path])
    } else if (remoteDrawing.action === "clear") {
      // Clear canvas
      setPaths([])
      setCurrentPath([])
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [remoteDrawing, isActive])

  // Draw all paths
  const drawPaths = (ctx: CanvasRenderingContext2D, pathsToDraw: DrawingPath[]) => {
    pathsToDraw.forEach((path) => {
      if (path.length < 2) return

      ctx.beginPath()
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      // Move to the first point
      ctx.moveTo(path[0].x, path[0].y)

      // Draw lines to each subsequent point
      for (let i = 1; i < path.length; i++) {
        const point = path[i]
        ctx.strokeStyle = point.mode === "eraser" ? "#FFFFFF" : point.color
        ctx.lineWidth = point.width
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(point.x, point.y)
      }
    })
  }

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPoint: DrawingPoint = {
      x,
      y,
      width: penWidth,
      color: penColor,
      mode: drawingMode,
    }

    setCurrentPath([newPoint])
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPoint: DrawingPoint = {
      x,
      y,
      width: penWidth,
      color: penColor,
      mode: drawingMode,
    }

    setCurrentPath((prev) => [...prev, newPoint])

    // Draw the current stroke
    ctx.beginPath()
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = drawingMode === "eraser" ? "#FFFFFF" : penColor
    ctx.lineWidth = penWidth

    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1]
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    if (!isDrawing) return

    setIsDrawing(false)
    setPaths((prev) => [...prev, currentPath])

    // Send the drawing data to the remote user
    if (onDrawPath && currentPath.length > 0) {
      onDrawPath({
        action: "draw",
        path: currentPath,
      })
    }

    setCurrentPath([])
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDrawing) {
      handleMouseUp()
    }
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    e.preventDefault()
    setIsDrawing(true)

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const newPoint: DrawingPoint = {
      x,
      y,
      width: penWidth,
      color: penColor,
      mode: drawingMode,
    }

    setCurrentPath([newPoint])
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return

    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const newPoint: DrawingPoint = {
      x,
      y,
      width: penWidth,
      color: penColor,
      mode: drawingMode,
    }

    setCurrentPath((prev) => [...prev, newPoint])

    // Draw the current stroke
    ctx.beginPath()
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = drawingMode === "eraser" ? "#FFFFFF" : penColor
    ctx.lineWidth = penWidth

    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1]
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  // Clear the whiteboard
  const clearWhiteboard = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setPaths([])
    setCurrentPath([])

    // Notify remote user
    if (onClear) {
      onClear()
    }
  }

  // Set drawing mode
  const setMode = (mode: DrawingMode) => {
    setDrawingMode(mode)
  }

  // Handle pen width change
  const handlePenWidthChange = (value: number[]) => {
    setPenWidth(value[0])
  }

  if (!isActive) return null

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      {/* Canvas for drawing */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-2 flex items-center gap-2">
        <Button
          variant={drawingMode === "pen" ? "default" : "outline"}
          size="icon"
          onClick={() => setMode("pen")}
          title="Pen"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant={drawingMode === "eraser" ? "default" : "outline"}
          size="icon"
          onClick={() => setMode("eraser")}
          title="Eraser"
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <div className="flex items-center gap-2 px-2">
          <div
            className="w-4 h-4 rounded-full cursor-pointer border border-input"
            style={{ backgroundColor: "#FF3B30" }}
            onClick={() => setPenColor("#FF3B30")}
          />
          <div
            className="w-4 h-4 rounded-full cursor-pointer border border-input"
            style={{ backgroundColor: "#34C759" }}
            onClick={() => setPenColor("#34C759")}
          />
          <div
            className="w-4 h-4 rounded-full cursor-pointer border border-input"
            style={{ backgroundColor: "#007AFF" }}
            onClick={() => setPenColor("#007AFF")}
          />
          <div
            className="w-4 h-4 rounded-full cursor-pointer border border-input"
            style={{ backgroundColor: "#FFCC00" }}
            onClick={() => setPenColor("#FFCC00")}
          />
        </div>
        <div className="h-6 w-px bg-border mx-1" />
        <div className="w-24 px-2">
          <Slider
            value={[penWidth]}
            min={1}
            max={10}
            step={1}
            onValueChange={handlePenWidthChange}
            className="w-full"
          />
        </div>
        <div className="h-6 w-px bg-border mx-1" />
        <Button variant="outline" size="icon" onClick={clearWhiteboard} title="Clear">
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onClose} title="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
