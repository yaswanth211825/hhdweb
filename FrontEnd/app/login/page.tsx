import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UnderDevelopment } from "@/components/under-development"

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <UnderDevelopment
        title="Login"
        description="Secure JWT authentication for admin access is coming in the next sprint. For now, please contact us directly."
      />
      <Footer />
    </main>
  )
}
