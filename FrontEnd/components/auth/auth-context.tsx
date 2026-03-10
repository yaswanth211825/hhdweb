"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"

type AuthContextValue = {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase checks persisted session immediately on mount and keeps listening.
    // loading stays true until the first call — prevents auth flicker.
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = async () => {
    await signOut(getFirebaseAuth())
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
