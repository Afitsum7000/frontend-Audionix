"use client";

import Link from "next/link";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Mic className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">AUDIONIX</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </a>
          <a
            href="#demo"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo
          </a>
          <Link
            href="/docs"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            API Docs
          </Link>
        </div>

        <Button onClick={scrollToDemo} className="rounded-full">
          Try the Demo
        </Button>
      </div>
    </nav>
  );
}
