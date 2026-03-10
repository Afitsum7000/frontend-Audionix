"use client"

import { Suspense, useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/src/context/AuthProvider"
import { AudioLines, Loader2, AlertCircle, Mail } from "lucide-react"

function LoginInner() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState<"password" | "magic" | null>(null)
  const { login, loginWithMagicLink, user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setSubmitting("password")

    const result = await login(email, password)
    setSubmitting(null)

    if (result.error) {
      setError(result.error)
      return
    }

    const next = searchParams.get("next")
    router.push(next || "/dashboard")
  }

  const handleMagicLink = async () => {
    setError("")
    setMessage("")
    setSubmitting("magic")

    const result = await loginWithMagicLink(email)
    setSubmitting(null)

    if (result.error) {
      setError(result.error)
      return
    }

    setMessage("Check your email for the login link")
  }

  if (!loading && user) {
    const next = searchParams.get("next")
    router.push(next || "/dashboard")
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <AudioLines className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-semibold tracking-tight">AUDIONIX</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 p-3 text-sm text-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-accent" />
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || submitting !== null}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || submitting !== null}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || submitting !== null}
            >
              {submitting === "password" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading || submitting !== null || !email}
              onClick={handleMagicLink}
            >
              {submitting === "magic" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending magic link...
                </>
              ) : (
                "Email me a magic link"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}
