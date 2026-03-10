import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Maximize, MapPin, Calendar, Tag } from "lucide-react"
import { getProjectBySlug } from "@/lib/api"
import { EnquiryForm } from "./enquiry-form"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function FloorPlanDetailPage({ params }: PageProps) {
  const { slug } = await params

  let plan
  try {
    plan = await getProjectBySlug(slug)
  } catch {
    notFound()
  }

  const images = plan.files.filter((f) => f.fileType === "IMAGE" || f.fileType === "DRAWING")
  const coverUrl = plan.coverImageUrl ?? images[0]?.fileUrl ?? null

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Back */}
        <Link
          href="/floor-plans"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Floor Plans
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              {plan.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-3">
                  <Tag className="w-3 h-3" />
                  {plan.category.name}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                {plan.title}
              </h1>
              {plan.description && (
                <p className="text-muted-foreground leading-relaxed">{plan.description}</p>
              )}
            </div>

            {/* Cover Image */}
            {coverUrl && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted">
                <Image
                  src={coverUrl}
                  alt={plan.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Additional files */}
            {images.length > 1 && (
              <div>
                <h2 className="font-semibold text-foreground mb-3">Floor Plan Files</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={file.fileUrl}
                        alt={file.title ?? plan.title}
                        fill
                        sizes="33vw"
                        className="object-contain"
                      />
                      {file.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                          {file.title}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Specs */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.areaSqft && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Maximize className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Plot Area</div>
                      <div className="font-semibold">
                        {plan.areaSqft.toLocaleString()} sq ft
                      </div>
                    </div>
                  </div>
                )}

                {plan.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-semibold">{plan.location}</div>
                    </div>
                  </div>
                )}

                {plan.yearCompleted && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Year</div>
                      <div className="font-semibold">{plan.yearCompleted}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enquiry Form */}
            <EnquiryForm projectId={plan.id} planTitle={plan.title} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
