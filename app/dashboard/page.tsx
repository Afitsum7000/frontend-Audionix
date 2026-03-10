"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/src/context/AuthProvider"
import { supabase } from "@/src/lib/supabaseClient"
import { ProtectedRoute } from "@/src/components/ProtectedRoute"
import { AudioLines, LogOut, FileAudio, Clock, Zap, Copy, Check } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { formatDistanceToNow, format } from "date-fns"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [profileCreatedAt, setProfileCreatedAt] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadProfile() {
      if (!user) return
      setProfileLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", user.id)
        .maybeSingle()

      if (!mounted) return
      if (error) {
        setProfileCreatedAt(null)
      } else {
        setProfileCreatedAt(data?.created_at ?? null)
      }
      setProfileLoading(false)
    }
    loadProfile()
    return () => {
      mounted = false
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("demo_api_key_xxxxxxxxxxxx")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createdAtText = useMemo(() => {
    const raw = profileCreatedAt || user?.created_at
    if (!raw) return null
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return null
    return { absolute: format(d, "PPP"), relative: formatDistanceToNow(d, { addSuffix: true }) }
  }, [profileCreatedAt, user?.created_at])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <AudioLines className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">AUDIONIX</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your account and transcription usage.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Account</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="mt-1 font-medium">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Created</dt>
                  <dd className="mt-1 font-medium">
                    {profileLoading ? (
                      <span className="text-muted-foreground">Loading…</span>
                    ) : createdAtText ? (
                      <span title={createdAtText.absolute}>{createdAtText.relative}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link href="/transcribe">Transcribe</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/docs">API Docs</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <FileAudio className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Transcriptions</p>
                  <p className="text-2xl font-bold">—</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minutes Processed</p>
                  <p className="text-2xl font-bold">—</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">API Calls This Month</p>
                  <p className="text-2xl font-bold">—</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">API Key</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <code className="flex-1 rounded-lg bg-secondary px-4 py-3 font-mono text-sm overflow-x-auto">
                demo_api_key_xxxxxxxxxxxx
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyApiKey}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              API key management will appear here. For now, see the{" "}
              <Link href="/docs" className="text-accent hover:underline">
                API documentation
              </Link>
              .
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
