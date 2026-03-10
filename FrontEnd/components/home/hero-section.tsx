"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, Phone, ChevronDown } from "lucide-react"

export function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-bg.jpg" 
          alt="" 
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Building Dreams with Quality Craftsmanship
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
            Welcome to <span className="text-primary">Happy Home Developers</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
            We build more than structures — we build dreams. From residential homes to commercial projects,
            renovations, and custom builds, our experienced team delivers reliable, on-time results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-14 text-base"
            >
              <Link href="/services">
                <Wrench className="w-5 h-5 mr-2" />
                Explore Services
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 h-14 text-base border-primary/20 hover:bg-primary/5"
            >
              <Link href="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Quick Enquiry
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Scroll to content"
        >
          <span className="text-sm font-medium">Explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
