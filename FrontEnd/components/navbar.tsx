"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Menu, X, Home, Grid3X3, Image, Wrench, Building2, Phone,
  User, LogOut, LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-context"

const navLinks = [
  { href: "/",            label: "Home",       icon: Home },
  { href: "/services",    label: "Services",   icon: Wrench },
  { href: "/projects",    label: "Projects",   icon: Building2 },
  { href: "/floor-plans", label: "Floor Plans", icon: Grid3X3 },
  { href: "/gallery",     label: "Gallery",    icon: Image },
  { href: "/contact",     label: "Contact",    icon: Phone },
]

/** First-letter initials from display name or email */
function getInitials(displayName: string | null, email: string | null): string {
  if (displayName) {
    return displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }
  return (email?.[0] ?? "U").toUpperCase()
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoggedIn, loading, logout } = useAuth()
  const router = useRouter()

  const initials = getInitials(user?.displayName ?? null, user?.email ?? null)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              Happy Home Developers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA — auth-aware */}
          <div className="hidden lg:flex items-center gap-3">
            {!loading && (
              isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors outline-none">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold select-none">
                          {initials}
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground max-w-[130px] truncate">
                        {user?.displayName ?? user?.email}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-lg font-semibold">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                      >
                        <link.icon className="w-5 h-5 text-muted-foreground" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto pt-8 flex flex-col gap-3">
                  {!loading && (
                    isLoggedIn ? (
                      <>
                        {/* Logged-in mobile: show user info + dashboard + logout */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold select-none">
                              {initials}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {user?.displayName && (
                              <p className="text-sm font-medium truncate">{user.displayName}</p>
                            )}
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          </div>
                        </div>
                        <SheetClose asChild>
                          <Button variant="outline" asChild className="w-full">
                            <Link href="/dashboard">
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Dashboard
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full text-destructive border-destructive/40 hover:bg-destructive/10"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Button variant="outline" asChild className="w-full">
                            <Link href="/login">
                              <User className="w-4 h-4 mr-2" />
                              Login
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/contact">Book Consultation</Link>
                          </Button>
                        </SheetClose>
                      </>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </nav>
    </header>
  )
}
