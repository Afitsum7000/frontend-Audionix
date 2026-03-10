"use client"

import Link from "next/link"
import { ProtectedRoute } from "@/src/components/ProtectedRoute"
import { DemoUploader } from "@/components/demo-uploader"
import { Button } from "@/components/ui/button"

export default function TranscribePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Transcribe</h1>
              <p className="mt-1 text-muted-foreground">
                Upload an audio file to generate a transcription.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </div>

          <DemoUploader />
        </div>
      </div>
    </ProtectedRoute>
  )
}

