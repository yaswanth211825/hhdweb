"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Grid3X3, Phone, LogOut, User, Mail, ShieldCheck, Sparkles,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-context"

export default function DashboardPage() {
  const { user, isLoggedIn, loading, logout } = useAuth()
  const router = useRouter()

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login")
    }
  }, [isLoggedIn, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Show spinner while Firebase resolves session or while redirecting
  if (loading || !isLoggedIn) {
    return (
      <main className="min-h-screen pt-20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </main>
    )
  }

  // Initials for avatar fallback
  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? "U").toUpperCase()

  const signInMethod =
    user?.providerData?.[0]?.providerId === "google.com"
      ? "Google"
      : "Email & Password"

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-5xl">

        {/* ── Profile header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              {user?.displayName
                ? `Welcome, ${user.displayName.split(" ")[0]}!`
                : "Welcome!"}
            </h1>
            <p className="text-muted-foreground mt-1 truncate">{user?.email}</p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex-shrink-0 text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* ── Cards grid ──────────────────────────────────────────── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Account info */}
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.displayName && (
                <div>
                  <p className="text-xs text-muted-foreground">Full name</p>
                  <p className="text-sm font-medium">{user.displayName}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium break-all flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Signed in with</p>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {signInMethod}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Browse floor plans */}
          <Card className="hover:border-primary/50 transition-colors group cursor-pointer"
                onClick={() => router.push("/floor-plans")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Browse Floor Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore our curated collection of residential and commercial floor plans.
              </p>
              <p className="text-xs text-primary mt-3 group-hover:underline font-medium">
                View all plans →
              </p>
            </CardContent>
          </Card>

          {/* Contact us */}
          <Card className="hover:border-primary/50 transition-colors group cursor-pointer"
                onClick={() => router.push("/contact")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get in touch with our team for custom design requests and enquiries.
              </p>
              <p className="text-xs text-primary mt-3 group-hover:underline font-medium">
                Send a message →
              </p>
            </CardContent>
          </Card>

          {/* Consultation promo */}
          <Card className="sm:col-span-2 lg:col-span-3 border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors group cursor-pointer"
                onClick={() => router.push("/contact") }>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Need a Custom Build Consultation?</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Share your requirement and our team will guide you with the right construction approach.
                </p>
              </div>
              <span className="text-xs text-primary group-hover:underline font-medium whitespace-nowrap">
                Contact now →
              </span>
            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </main>
  )
}
