"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, AudioLines } from "lucide-react"

// Pre-computed heights to avoid hydration mismatch
const WAVEFORM_HEIGHTS = [
  40, 49, 57, 63, 67, 69, 69, 66, 61, 55,
  48, 41, 35, 31, 30, 31, 35, 41, 48, 55,
  61, 66, 69, 69, 67, 63, 57, 49, 40, 32,
  25, 20, 18, 18, 21, 26, 32, 39, 47, 54
]

export function Hero() {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
          <AudioLines className="h-4 w-4 text-accent" />
          <span className="text-muted-foreground">Voice to Text AI</span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-balance text-5xl font-semibold tracking-tight md:text-7xl">
          Turn Voice Into Text{" "}
          <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          AI powered speech-to-text transcription for apps and developers.
          Accurate, fast, and simple to integrate.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={scrollToDemo} className="group rounded-full px-8">
            Try the Demo
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
            <Link href="/docs">View API Docs</Link>
          </Button>
        </div>

        {/* Waveform Visual */}
        <div className="mt-16 flex items-center justify-center gap-1">
          {WAVEFORM_HEIGHTS.map((height, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-accent/60"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
