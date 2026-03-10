import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UnderDevelopment } from "@/components/under-development"

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <UnderDevelopment
        title="Our Services"
        description="A detailed services page covering architectural planning, structural design, construction, and interior design is on the way."
      />
      <Footer />
    </main>
  )
}
