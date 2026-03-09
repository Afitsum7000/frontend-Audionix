import { Upload, Cpu, FileText } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Audio",
    description: "Drag and drop or select your audio file in any common format.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Processes Speech",
    description: "Our advanced AI analyzes and transcribes the audio content.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Receive Transcription",
    description: "Get your accurate text transcription ready to use instantly.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Three simple steps to transform your audio into accurate text.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border md:block" />
              )}
              
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                <step.icon className="h-7 w-7 text-accent" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                  {index + 1}
                </span>
              </div>
              
              <h3 className="mb-2 text-xl font-medium">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
