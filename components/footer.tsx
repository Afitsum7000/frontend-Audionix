import { Mic } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Mic className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold">AUDIONIX</span>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Voice to Text AI Demo</p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2026 Audionix
          </p>
        </div>
      </div>
    </footer>
  )
}
