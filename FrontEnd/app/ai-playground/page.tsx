import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UnderDevelopment } from "@/components/under-development"

export default function AIPlaygroundPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <UnderDevelopment
        title="Construction Planning Tools"
        description="More planning resources and customer tools are being prepared and will be available soon."
      />
      <Footer />
    </main>
  )
}
