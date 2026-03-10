"use client"

import { use } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingPlaygroundButton } from "@/components/floating-playground-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  MapPin,
  Maximize,
  Calendar,
  Building,
  Bed,
  Bath,
  MessageSquare,
} from "lucide-react"

const projectData = {
  1: {
    id: 1,
    title: "Sunrise Villa",
    type: "4BHK Duplex",
    plotSize: "2400 sq ft",
    builtUpArea: "2200 sq ft",
    location: "Green Valley Estate",
    year: "2024",
    status: "Completed",
    bedrooms: 4,
    bathrooms: 4,
    floors: 2,
    description:
      "A stunning 4BHK duplex villa featuring modern architecture with traditional elements. The home includes spacious living areas, a modular kitchen, and a landscaped garden.",
    features: [
      "Modular Kitchen with Chimney",
      "Italian Marble Flooring",
      "Solar Water Heater",
      "Landscaped Garden",
      "Car Parking for 2",
      "Smart Home Features",
    ],
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const project = projectData[id as keyof typeof projectData] || projectData[1]

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-muted">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                {project.type}
              </span>
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                {project.status}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                About This Project
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Project Gallery
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-[4/3] rounded-xl overflow-hidden bg-muted"
                  >
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-semibold">{project.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Maximize className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Plot Size</div>
                    <div className="font-semibold">{project.plotSize}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Built-up Area</div>
                    <div className="font-semibold">{project.builtUpArea}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bed className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                    <div className="font-semibold">{project.bedrooms}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bath className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                    <div className="font-semibold">{project.bathrooms}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                    <div className="font-semibold">{project.year}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">
                  Want a Similar Design?
                </h3>
                <p className="text-primary-foreground/70 text-sm mb-4">
                  Contact us to discuss your project requirements and get a custom quote.
                </p>
                <Button
                  asChild
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Link href="/contact">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingPlaygroundButton />
    </main>
  )
}
