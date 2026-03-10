import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Pencil, Wand2, Layers } from "lucide-react"

const features = [
  {
    icon: Pencil,
    title: "Sketch Your Ideas",
    description: "Draw rooms and layouts on our intuitive grid canvas",
  },
  {
    icon: Wand2,
    title: "AI Generation",
    description: "Let AI transform your sketches into professional floor plans",
  },
  {
    icon: Layers,
    title: "Multiple Options",
    description: "Get various layout suggestions for your design",
  },
]

export function AIPlaygroundPromo() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Design</span>
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Not Sure What You Want? Let AI Help You Design
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Sketch your own layout and let our AI generate professional floor plan possibilities. 
              Experiment with different configurations and discover the perfect design for your dream home.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Link href="/ai-playground">
                <Sparkles className="w-5 h-5 mr-2" />
                Launch Playground
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square bg-background rounded-2xl border border-border p-6 shadow-lg">
              {/* Grid Pattern */}
              <div 
                className="w-full h-full rounded-xl bg-muted/50 relative overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, var(--border) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              >
                {/* Sample Sketch Elements */}
                <div className="absolute top-8 left-8 w-24 h-20 border-2 border-primary/40 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary font-medium">Bedroom</span>
                </div>
                <div className="absolute top-8 right-8 w-20 h-20 border-2 border-accent/40 rounded bg-accent/10 flex items-center justify-center">
                  <span className="text-xs text-accent font-medium">Kitchen</span>
                </div>
                <div className="absolute bottom-8 left-8 right-8 h-16 border-2 border-muted-foreground/40 rounded bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground font-medium">Living Room</span>
                </div>
                <div className="absolute top-32 left-8 w-16 h-12 border-2 border-primary/40 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary font-medium">Bath</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
