"use client"

import { useState, useCallback } from "react"
import { Upload, FileAudio, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { TranscriptionResult } from "@/components/transcription-result"
import { useAuth } from "@/src/context/AuthProvider"
import { Input } from "@/components/ui/input"
import { backendUrl } from "@/src/lib/backend"

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB
const ACCEPTED_FORMATS = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/m4a", "audio/x-m4a", "audio/mp4"]

export function DemoUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string>("")

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 25MB limit. Please upload a smaller file."
    }
    if (!ACCEPTED_FORMATS.some(format => file.type.includes(format.split("/")[1]))) {
      return "Invalid file format. Please upload MP3, WAV, or M4A files."
    }
    return null
  }

  const handleFile = useCallback((selectedFile: File) => {
    setError(null)
    setTranscription(null)
    
    const validationError = validateFile(selectedFile)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setFile(selectedFile)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }, [handleFile])

  const removeFile = () => {
    setFile(null)
    setTranscription(null)
    setError(null)
  }

  const { session } = useAuth()

  const handleTranscribe = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(backendUrl("/transcribe"), {
        method: "POST",
        headers: {
          ...(apiKey.trim() ? { "X-API-Key": apiKey.trim() } : {}),
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        let detail = response.statusText
        try {
          const errJson = await response.json()
          if (errJson?.detail) {
            detail = errJson.detail
          }
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(`Transcription failed: ${detail}`)
      }

      const data = await response.json()
      setTranscription(data.transcription || data.text || JSON.stringify(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during transcription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="demo" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Try It Now
          </h2>
          <p className="text-muted-foreground">
            Upload an audio file and see our AI transcription in action.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="mb-6">
            <label className="text-sm font-medium">API key</label>
            <div className="mt-2">
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="audionix_live_..."
                disabled={isLoading}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Create an API key in your dashboard, then paste it here to run a transcription.
            </p>
          </div>
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              isDragging
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/50"
            }`}
          >
            <input
              type="file"
              accept=".mp3,.wav,.m4a,audio/*"
              onChange={handleFileInput}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={isLoading}
            />
            
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Upload className="h-7 w-7 text-muted-foreground" />
            </div>
            
            <p className="mb-2 text-lg font-medium">
              Drop your audio file here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse • MP3, WAV, M4A • Max 25MB
            </p>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 flex items-center justify-between rounded-xl bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileAudio className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                disabled={isLoading}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Transcribe Button */}
          <Button
            onClick={handleTranscribe}
            disabled={!file || isLoading}
            className="mt-6 w-full rounded-xl py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Transcribing...
              </>
            ) : (
              "Transcribe Audio"
            )}
          </Button>

          {/* Transcription Result */}
          {transcription && <TranscriptionResult text={transcription} />}
        </div>
      </div>
    </section>
  )
}
