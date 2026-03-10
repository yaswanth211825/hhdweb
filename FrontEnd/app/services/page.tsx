import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Hammer, Home, Paintbrush } from "lucide-react"

const services = [
  {
    title: "Residential Construction",
    description:
      "Complete home construction services from planning to handover for villas, independent homes, and apartment units.",
    icon: Home,
  },
  {
    title: "Commercial Projects",
    description:
      "Execution of office spaces, retail showrooms, and commercial buildings with a focus on quality, timelines, and compliance.",
    icon: Building2,
  },
  {
    title: "Renovations & Remodeling",
    description:
      "Upgrade existing spaces with structural improvements, layout redesign, and modern finishing for better functionality.",
    icon: Paintbrush,
  },
  {
    title: "Custom Builds",
    description:
      "Tailored construction solutions designed around your budget, plot conditions, and long-term lifestyle needs.",
    icon: Hammer,
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              What We Offer
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Construction Services for Every Stage
            </h1>
            <p className="text-muted-foreground">
              Whether you're starting from scratch or upgrading an existing property, our team delivers practical,
              high-quality construction solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="border-border/70">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-secondary/40 border border-border p-6 md:p-8">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">Need expert advice for your project?</h2>
            <p className="text-muted-foreground mb-6">
              Share your requirement with us and get a consultation from our team.
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
