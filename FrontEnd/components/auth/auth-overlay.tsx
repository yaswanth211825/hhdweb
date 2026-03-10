"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { getFirebaseAuth, getGoogleAuthProvider } from "@/lib/firebase"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, X, Loader2 } from "lucide-react"

type AuthOverlayProps = {
  children: ReactNode
  enabled?: boolean
}

export function AuthOverlay({ children, enabled = true }: AuthOverlayProps) {
  const router = useRouter()
  const { isLoggedIn, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [forgotEmail, setForgotEmail] = useState("")
  const [view, setView] = useState<"auth" | "forgot">("auth")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [forgotSent, setForgotSent] = useState(false)

  useEffect(() => {
    if (enabled && !isLoggedIn && !loading) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [enabled, isLoggedIn, loading])

  // ── auth handlers ─────────────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
    setError("")
    setBusy(true)
    try {
      await signInWithPopup(getFirebaseAuth(), getGoogleAuthProvider())
    } catch (e: unknown) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), loginData.email, loginData.password)
    } catch (e: unknown) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setBusy(true)
    try {
      await createUserWithEmailAndPassword(getFirebaseAuth(), signupData.email, signupData.password)
    } catch (e: unknown) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), forgotEmail)
      setForgotSent(true)
    } catch (e: unknown) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  const handleSkip = () => router.push("/gallery")

  // ── render ────────────────────────────────────────────────────────────────

  // While Firebase resolves the persisted session, render children normally
  // to avoid a flash of the login overlay for already-logged-in users.
  if (!enabled || loading || isLoggedIn) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-60">
        {children}
      </div>

      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md px-4">
          <Card className="relative">
            <button
              type="button"
              onClick={handleSkip}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-secondary"
              aria-label="Skip login and view gallery"
            >
              <X className="w-4 h-4" />
            </button>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-serif">
                {view === "forgot" ? "Reset Password" : "Login or Register"}
              </CardTitle>
              <CardDescription>
                {view === "forgot"
                  ? "Enter your email and we'll send a reset link."
                  : "Sign in to request services and view full project details."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* ── Forgot password view ──────────────────────────────── */}
              {view === "forgot" ? (
                forgotSent ? (
                  <div className="text-center py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Reset link sent to <strong>{forgotEmail}</strong>. Check your inbox.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setView("auth"); setForgotSent(false) }}
                    >
                      Back to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={busy}>
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                    </Button>
                    <button
                      type="button"
                      className="w-full text-xs text-muted-foreground hover:underline"
                      onClick={() => { setView("auth"); setError("") }}
                    >
                      Back to Login
                    </button>
                  </form>
                )
              ) : (
                /* ── Login / Sign-up tabs ─────────────────────────────── */
                <>
                  {/* Google sign-in */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-4 gap-2"
                    disabled={busy}
                    onClick={handleGoogleSignIn}
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Continue with Google
                  </Button>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">or</span>
                    </div>
                  </div>

                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* Login tab */}
                    <TabsContent value="login" className="mt-0 space-y-4">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="overlay-login-email">Email</Label>
                          <Input
                            id="overlay-login-email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="overlay-login-password">Password</Label>
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline"
                              onClick={() => { setView("forgot"); setError(""); setForgotEmail(loginData.email) }}
                            >
                              Forgot password?
                            </button>
                          </div>
                          <div className="relative">
                            <Input
                              id="overlay-login-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              required
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                          disabled={busy}
                        >
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Sign Up tab */}
                    <TabsContent value="signup" className="mt-0 space-y-4">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="overlay-signup-name">Full Name</Label>
                          <Input
                            id="overlay-signup-name"
                            placeholder="John Doe"
                            required
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="overlay-signup-email">Email</Label>
                          <Input
                            id="overlay-signup-email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="overlay-signup-phone">Phone Number</Label>
                          <Input
                            id="overlay-signup-phone"
                            type="tel"
                            placeholder="+91-XXXXXXXXXX"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="overlay-signup-password">Password</Label>
                          <Input
                            id="overlay-signup-password"
                            type="password"
                            placeholder="Create a password (min 6 characters)"
                            required
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="overlay-signup-confirm">Confirm Password</Label>
                          <Input
                            id="overlay-signup-confirm"
                            type="password"
                            placeholder="Confirm your password"
                            required
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                          disabled={busy}
                        >
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-4 text-center text-xs text-muted-foreground">
                    Or press the close button to skip login and browse our gallery.
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

function friendlyError(e: unknown): string {
  if (e instanceof Error) {
    const code = (e as { code?: string }).code ?? ""
    const map: Record<string, string> = {
      "auth/invalid-credential":     "Incorrect email or password.",
      "auth/user-not-found":         "No account found with this email.",
      "auth/wrong-password":         "Incorrect password.",
      "auth/email-already-in-use":   "An account with this email already exists.",
      "auth/weak-password":          "Password must be at least 6 characters.",
      "auth/invalid-email":          "Please enter a valid email address.",
      "auth/popup-closed-by-user":   "Sign-in popup was closed.",
      "auth/too-many-requests":      "Too many attempts. Please try again later.",
      "auth/network-request-failed": "Network error. Check your connection.",
    }
    return map[code] ?? e.message
  }
  return "Something went wrong. Please try again."
}
