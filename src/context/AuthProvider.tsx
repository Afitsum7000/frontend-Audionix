"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { supabase } from "@/src/lib/supabaseClient"

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (
    email: string,
    password: string
  ) => Promise<{ error?: string; needsEmailVerification?: boolean }>
  loginWithMagicLink: (email: string) => Promise<{ error?: string }>
  logout: () => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function friendlyAuthError(message?: string) {
  const msg = (message || "").toLowerCase()
  if (!msg) return "Something went wrong. Please try again."
  if (msg.includes("invalid login credentials")) return "Invalid email or password."
  if (msg.includes("email not confirmed")) return "Please verify your email before signing in."
  if (msg.includes("user already registered") || msg.includes("already registered"))
    return "An account with this email already exists. Try signing in instead."
  if (msg.includes("expired") && msg.includes("link"))
    return "This magic link has expired. Please request a new one."
  if (msg.includes("network") || msg.includes("fetch")) return "Network error. Check your connection and try again."
  return message || "Something went wrong. Please try again."
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth
      .getSession()
      .then((res: { data: { session: Session | null }; error: { message: string } | null }) => {
        const { data, error } = res
        if (!mounted) return
        if (error) {
          setSession(null)
          setUser(null)
        } else {
          setSession(data.session ?? null)
          setUser(data.session?.user ?? null)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, nextSession: Session | null) => {
      if (!mounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: friendlyAuthError(error.message) }
    return {}
  }, [])

  const signup = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: friendlyAuthError(error.message) }

    const signedUpUser = data.user
    if (signedUpUser) {
      // Best-effort profile creation. Requires a `profiles` table + RLS allowing inserts for `auth.uid() = id`.
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: signedUpUser.id,
            email: signedUpUser.email ?? email,
            created_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )

      if (profileError) {
        // Do not fail signup for profile creation issues; the user can still verify/login.
        // eslint-disable-next-line no-console
        console.warn("Profile upsert failed:", profileError.message)
      }
    }

    // If email confirmations are enabled, Supabase will not create a session immediately.
    const needsEmailVerification = !data.session
    return { needsEmailVerification }
  }, [])

  const loginWithMagicLink = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Ensures the link returns to this app after opening email.
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    })
    if (error) return { error: friendlyAuthError(error.message) }
    return {}
  }, [])

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return { error: friendlyAuthError(error.message) }
    return {}
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, login, signup, loginWithMagicLink, logout }),
    [user, session, loading, login, signup, loginWithMagicLink, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

