"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TranscriptionResultProps {
  text: string
}

export function TranscriptionResult({ text }: TranscriptionResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Failed to copy text")
    }
  }

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Transcription Result</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2 rounded-lg"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Text
            </>
          )}
        </Button>
      </div>
      
      <div className="rounded-xl border border-border bg-background p-6">
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
