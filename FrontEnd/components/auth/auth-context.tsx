"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type AuthContextValue = {
  isLoggedIn: boolean
  setLoggedIn: (value: boolean) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Temporary implementation backed by localStorage.
    // This will be replaced by Firebase auth state listener.
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem("isLoggedIn")
    setIsLoggedIn(stored === "true")
  }, [])

  const setLoggedIn = (value: boolean) => {
    setIsLoggedIn(value)
    if (typeof window !== "undefined") {
      if (value) {
        window.localStorage.setItem("isLoggedIn", "true")
      } else {
        window.localStorage.removeItem("isLoggedIn")
      }
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
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

