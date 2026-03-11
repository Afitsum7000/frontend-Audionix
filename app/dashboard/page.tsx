"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/src/context/AuthProvider"
import { supabase } from "@/src/lib/supabaseClient"
import { ProtectedRoute } from "@/src/components/ProtectedRoute"
import { AudioLines, LogOut, FileAudio, Clock, Zap } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { backendUrl, fetchJson } from "@/src/lib/backend"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    total_transcriptions: number
    minutes_processed: number
    api_calls_this_month: number
    active_api_keys: number
  } | null>(null)

  const [keysLoading, setKeysLoading] = useState(false)
  const [keysError, setKeysError] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<
    { id: string; name: string; created_at: string; last_used_at?: string | null; revoked: boolean }[]
  >([])

  const [newKeyName, setNewKeyName] = useState("")
  const [createLoading, setCreateLoading] = useState(false)
  const [createdKey, setCreatedKey] = useState<{ id: string; api_key: string } | null>(null)
  const [createdKeyCopied, setCreatedKeyCopied] = useState(false)
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

  useEffect(() => {
    let mounted = true
    async function loadTenantData() {
      if (!user) return
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return

      setStatsLoading(true)
      setStatsError(null)
      setKeysLoading(true)
      setKeysError(null)
      try {
        const [s, k] = await Promise.all([
          fetchJson<{
            total_transcriptions: number
            minutes_processed: number
            api_calls_this_month: number
            active_api_keys: number
          }>(backendUrl("/dashboard/stats"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchJson<
            { id: string; name: string; created_at: string; last_used_at?: string | null; revoked: boolean }[]
          >(backendUrl("/api-keys"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        if (!mounted) return
        setStats(s)
        setApiKeys(k)
      } catch (e) {
        if (!mounted) return
        const msg = e instanceof Error ? e.message : "Failed to load dashboard data."
        setStatsError(msg)
        setKeysError(msg)
      } finally {
        if (!mounted) return
        setStatsLoading(false)
        setKeysLoading(false)
      }
    }
    loadTenantData()
    return () => {
      mounted = false
    }
  }, [user])

  const handleCreateApiKey = async () => {
    if (!user) return
    const name = newKeyName.trim()
    if (!name) return

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return

    setCreateLoading(true)
    setKeysError(null)
    try {
      const created = await fetchJson<{ api_key: string; id: string }>(backendUrl("/api-keys"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      setCreatedKey({ id: created.id, api_key: created.api_key })
      setCreatedKeyCopied(false)
      setNewKeyName("")

      const fresh = await fetchJson<
        { id: string; name: string; created_at: string; last_used_at?: string | null; revoked: boolean }[]
      >(backendUrl("/api-keys"), { headers: { Authorization: `Bearer ${token}` } })
      setApiKeys(fresh)
    } catch (e) {
      setKeysError(e instanceof Error ? e.message : "Failed to create API key.")
    } finally {
      setCreateLoading(false)
    }
  }

  const handleRevokeKey = async (id: string) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return

    setKeysError(null)
    try {
      await fetchJson<{ success: boolean }>(backendUrl(`/api-keys/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const fresh = await fetchJson<
        { id: string; name: string; created_at: string; last_used_at?: string | null; revoked: boolean }[]
      >(backendUrl("/api-keys"), { headers: { Authorization: `Bearer ${token}` } })
      setApiKeys(fresh)
    } catch (e) {
      setKeysError(e instanceof Error ? e.message : "Failed to revoke API key.")
    }
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
                  <p className="text-2xl font-bold">
                    {statsLoading ? "…" : stats ? stats.total_transcriptions.toLocaleString() : "—"}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {statsLoading ? "…" : stats ? Math.round(stats.minutes_processed).toLocaleString() : "—"}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {statsLoading ? "…" : stats ? stats.api_calls_this_month.toLocaleString() : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">API Keys</h2>
            {statsError ? <p className="mb-4 text-sm text-destructive">{statsError}</p> : null}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="New API key name (e.g. Production Key)"
                />
                <Button onClick={handleCreateApiKey} disabled={createLoading || !newKeyName.trim()}>
                  Create API key
                </Button>
              </div>

              {keysError ? <p className="text-sm text-destructive">{keysError}</p> : null}

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keysLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground">
                          Loading…
                        </TableCell>
                      </TableRow>
                    ) : apiKeys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground">
                          No API keys yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiKeys.map((k) => (
                        <TableRow key={k.id}>
                          <TableCell className="font-medium">{k.name}</TableCell>
                          <TableCell>{k.created_at ? format(new Date(k.created_at), "PPP") : "—"}</TableCell>
                          <TableCell>
                            {k.last_used_at ? formatDistanceToNow(new Date(k.last_used_at), { addSuffix: true }) : "—"}
                          </TableCell>
                          <TableCell>{k.revoked ? "Revoked" : "Active"}</TableCell>
                          <TableCell className="text-right">
                            {k.revoked ? null : (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Revoke
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This key will stop working immediately. You can’t undo this action.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRevokeKey(k.id)}>
                                      Revoke
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <Dialog open={!!createdKey} onOpenChange={(open) => (!open ? setCreatedKey(null) : null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>API key created</DialogTitle>
                    <DialogDescription>
                      Copy this API key now. For security, it will only be shown once.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <code className="rounded-lg bg-secondary px-4 py-3 font-mono text-sm overflow-x-auto">
                      {createdKey?.api_key}
                    </code>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (!createdKey?.api_key) return
                        navigator.clipboard.writeText(createdKey.api_key)
                        setCreatedKeyCopied(true)
                        setTimeout(() => setCreatedKeyCopied(false), 2000)
                      }}
                    >
                      {createdKeyCopied ? "Copied" : "Copy API key"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <p className="text-sm text-muted-foreground">
                Use your API key with `X-API-Key`. See{" "}
                <Link href="/docs" className="text-accent hover:underline">
                  API documentation
                </Link>
                .
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
