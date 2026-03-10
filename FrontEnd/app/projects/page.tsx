import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Our Work</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Projects
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This section is currently being updated.
          </p>
        </div>
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Projects coming soon.</p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
