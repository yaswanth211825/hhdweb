"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthOverlay } from "@/components/auth/auth-overlay"
import { useAuth } from "@/components/auth/auth-context"

export default function LoginPage() {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard as soon as the user is authenticated
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace("/dashboard")
    }
  }, [isLoggedIn, loading, router])

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      {/* AuthOverlay shows the login/signup modal; on success isLoggedIn becomes true
          and the useEffect above redirects to /dashboard */}
      <AuthOverlay enabled={!isLoggedIn}>
        <div className="min-h-[60vh]" />
      </AuthOverlay>

      <Footer />
    </main>
  )
}
