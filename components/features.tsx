import { Zap, Code2, FileAudio } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Fast Transcription",
    description: "Get accurate transcriptions in seconds with our state-of-the-art AI models optimized for speed.",
  },
  {
    icon: Code2,
    title: "Simple API Integration",
    description: "Integrate voice-to-text capabilities into your app with just a few lines of code.",
  },
  {
    icon: FileAudio,
    title: "Multiple Audio Formats",
    description: "Support for MP3, WAV, M4A, and more. Upload any common audio format seamlessly.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Powerful Features
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Everything you need to convert speech to text with enterprise-grade accuracy and speed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:bg-card/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
