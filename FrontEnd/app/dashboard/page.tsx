import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UnderDevelopment } from "@/components/under-development"

export default function DashboardPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <UnderDevelopment
        title="Admin Dashboard"
        description="The admin dashboard — where you'll view enquiries, manage floor plans, and track leads — is coming in the next sprint."
      />
      <Footer />
    </main>
  )
}
