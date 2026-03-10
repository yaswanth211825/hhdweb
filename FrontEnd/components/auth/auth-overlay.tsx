"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, X } from "lucide-react"
import { useState } from "react"

type AuthOverlayProps = {
  children: ReactNode
  enabled?: boolean
}

export function AuthOverlay({ children, enabled = true }: AuthOverlayProps) {
  const router = useRouter()
  const { isLoggedIn, setLoggedIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Ensure body behind overlay is not scrollable when auth is required
    if (enabled && !isLoggedIn) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [enabled, isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: this will later call Firebase Auth.
    setLoggedIn(true)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: this will later call Firebase Auth.
    setLoggedIn(true)
  }

  const handleSkip = () => {
    router.push("/gallery")
  }

  if (!enabled || isLoggedIn) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Blurred background content */}
      <div className="pointer-events-none select-none blur-sm opacity-60">
        {children}
      </div>

      {/* Fullscreen overlay */}
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
                Login or Register
              </CardTitle>
              <CardDescription>
                Sign in to request services, use the AI playground, and view full project details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

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
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overlay-login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="overlay-login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          required
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Continue
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0 space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="overlay-signup-name">Full Name</Label>
                      <Input
                        id="overlay-signup-name"
                        placeholder="John Doe"
                        required
                        value={signupData.name}
                        onChange={(e) =>
                          setSignupData({ ...signupData, name: e.target.value })
                        }
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
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overlay-signup-phone">Phone Number</Label>
                      <Input
                        id="overlay-signup-phone"
                        type="tel"
                        placeholder="+91-XXXXXXXXXX"
                        value={signupData.phone}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overlay-signup-password">Password</Label>
                      <Input
                        id="overlay-signup-password"
                        type="password"
                        placeholder="Create a password"
                        required
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            password: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-xs text-muted-foreground">
                Or press the close button to skip login and browse our gallery.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

