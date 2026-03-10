import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingPlaygroundButton } from "@/components/floating-playground-button"
import { HeroSection } from "@/components/home/hero-section"
import { TrustSection } from "@/components/home/trust-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { VideoSection } from "@/components/home/video-section"
import { DreamBuilderSection } from "@/components/home/dream-builder-section"
import { AIPlaygroundPromo } from "@/components/home/ai-playground-promo"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <FeaturedProjects />
      <VideoSection />
      <DreamBuilderSection />
      <AIPlaygroundPromo />
      <Footer />
      <FloatingPlaygroundButton />
    </main>
  )
}
