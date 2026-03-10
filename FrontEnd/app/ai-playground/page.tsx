import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UnderDevelopment } from "@/components/under-development"

export default function AIPlaygroundPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <UnderDevelopment
        title="AI Playground"
        description="Our AI-powered floor plan assistant — describe your plot and get instant plan suggestions — is coming in Sprint 3."
      />
      <Footer />
    </main>
  )
}
