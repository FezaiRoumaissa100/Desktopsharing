"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RepeatIcon as Record, Square, Pause, Play, Download, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SessionRecorderProps {
  isEnabled: boolean
  canvasRef: React.RefObject<HTMLCanvasElement>
  onRecordingStart?: () => void
  onRecordingStop?: (blob: Blob) => void
}

export function SessionRecorder({ isEnabled, canvasRef, onRecordingStart, onRecordingStop }: SessionRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      stopRecording()
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
      }
    }
  }, [downloadUrl])

  const startRecording = async () => {
    if (!canvasRef.current || !isEnabled) return

    try {
      setError(null)
      chunksRef.current = []
      setRecordingBlob(null)
      setDownloadUrl(null)

      // Get the stream from the canvas
      const stream = canvasRef.current.captureStream(30) // 30 FPS
      streamRef.current = stream

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        setRecordingBlob(blob)

        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)

        if (onRecordingStop) {
          onRecordingStop(blob)
        }
      }

      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      if (onRecordingStart) {
        onRecordingStart()
      }
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Failed to start recording. Make sure screen sharing is active.")
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause()
      setIsPaused(true)

      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume()
      setIsPaused(false)

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")
    ) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }

  const downloadRecording = () => {
    if (downloadUrl) {
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `session-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`
      a.click()
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours > 0 ? hours.toString().padStart(2, "0") : null,
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":")
  }

  if (!isEnabled) {
    return (
      <div className="p-4 text-center">
        <Record className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Session recording is not enabled for this session.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">{formatTime(recordingTime)}</span>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Recording</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          </div>
        )}
      </div>

      {isRecording && <Progress value={(recordingTime % 60) * (100 / 60)} className="h-1" />}

      <div className="flex items-center justify-between gap-2">
        {!isRecording ? (
          <Button onClick={startRecording} className="flex-1" disabled={!canvasRef.current}>
            <Record className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button onClick={resumeRecording} variant="outline" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button onClick={pauseRecording} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <Button onClick={stopRecording} variant="destructive" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>

      {downloadUrl && (
        <Button onClick={downloadRecording} variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Recording
        </Button>
      )}

      <p className="text-xs text-muted-foreground">Recordings are stored locally and are not uploaded to any server.</p>
    </div>
  )
}
