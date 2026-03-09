"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  BookOpen,
  Code,
  FileJson,
  Key,
  AlertCircle,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#introduction", label: "Introduction", icon: BookOpen },
  { href: "#endpoint", label: "Endpoint Overview", icon: Terminal },
  { href: "#authentication", label: "Authentication", icon: Key },
  { href: "#request-format", label: "Request Format", icon: Code },
  { href: "#example-request", label: "Example Request", icon: Terminal },
  { href: "#example-response", label: "Example Response", icon: FileJson },
  { href: "#notes", label: "Notes & Limitations", icon: AlertCircle },
];

export function DocsSidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 h-screen border-r border-border bg-sidebar">
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-5 border-b border-border"
      >
        <AudioLines className="h-6 w-6 text-accent" />
        <span className="text-lg font-semibold tracking-tight">AUDIONIX</span>
      </Link>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
          API Reference
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-border">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
