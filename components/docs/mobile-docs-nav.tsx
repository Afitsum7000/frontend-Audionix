"use client"

import { useState } from "react"
import Link from "next/link"
import { AudioLines, Menu, X, BookOpen, Code, FileJson, Key, AlertCircle, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "#introduction", label: "Introduction", icon: BookOpen },
  { href: "#endpoint", label: "Endpoint Overview", icon: Terminal },
  { href: "#authentication", label: "Authentication", icon: Key },
  { href: "#request-format", label: "Request Format", icon: Code },
  { href: "#example-request", label: "Example Request", icon: Terminal },
  { href: "#example-response", label: "Example Response", icon: FileJson },
  { href: "#notes", label: "Notes & Limitations", icon: AlertCircle },
]

export function MobileDocsNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <AudioLines className="h-5 w-5 text-accent" />
          <span className="font-semibold">AUDIONIX Docs</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 w-9 p-0"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 pt-14 bg-background">
          <nav className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              API Reference
            </div>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-border">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
