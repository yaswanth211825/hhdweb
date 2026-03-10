import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Maximize, ArrowRight } from "lucide-react"
import { getProjects } from "@/lib/api"

export async function FeaturedProjects() {
  let projects = []
  try {
    const result = await getProjects({ size: 5 })
    projects = result.data.content
  } catch {
    // Backend unavailable — render nothing (page still works)
    return null
  }

  if (projects.length === 0) return null

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Floor Plans from Database
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Featured Floor Plans
            </h2>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link href="/floor-plans">
              View All Floor Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/floor-plans/${project.slug}`}>
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {project.coverImageUrl ? (
                    <Image
                      src={project.coverImageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {project.categoryName && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                        {project.categoryName}
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {project.areaSqft && (
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5" />
                        {project.areaSqft.toLocaleString()} sq ft
                      </span>
                    )}
                    {project.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
