"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Demo validation
    if (!email || !password) {
      setIsLoading(false)
      return { success: false, error: "Please enter email and password" }
    }
    
    if (password.length < 6) {
      setIsLoading(false)
      return { success: false, error: "Invalid credentials" }
    }

    // Demo: Accept any valid-looking email/password
    setUser({
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
    })
    
    setIsLoading(false)
    return { success: true }
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Demo validation
    if (!email || !password || !name) {
      setIsLoading(false)
      return { success: false, error: "Please fill in all fields" }
    }
    
    if (password.length < 6) {
      setIsLoading(false)
      return { success: false, error: "Password must be at least 6 characters" }
    }

    if (!email.includes("@")) {
      setIsLoading(false)
      return { success: false, error: "Please enter a valid email" }
    }

    // Demo: Create user
    setUser({
      id: crypto.randomUUID(),
      email,
      name,
    })
    
    setIsLoading(false)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
