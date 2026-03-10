import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingPlaygroundButton } from "@/components/floating-playground-button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Maximize, Calendar } from "lucide-react"
import { getProjects } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  let projects = []
  try {
    const result = await getProjects({ size: 20 })
    projects = result.data.content
  } catch {
    // Backend unavailable — show empty state gracefully
  }

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Our Work</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Completed Projects
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our portfolio of successfully delivered homes and construction projects.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project.id} href={`/floor-plans/${project.slug}`}>
                <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.coverImageUrl ? (
                      <Image
                        src={project.coverImageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {project.categoryName && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                          {project.categoryName}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-xl mb-1 line-clamp-1">
                        {project.title}
                      </h3>
                      {project.location && (
                        <div className="flex items-center gap-1 text-white/80 text-sm">
                          <MapPin className="w-3.5 h-3.5" />
                          {project.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {project.areaSqft && (
                        <span className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          {project.areaSqft.toLocaleString()} sq ft
                        </span>
                      )}
                      {project.yearCompleted && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {project.yearCompleted}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No projects available yet. Check back soon!
            </p>
          </div>
        )}
      </div>

      <Footer />
      <FloatingPlaygroundButton />
    </main>
  )
}
