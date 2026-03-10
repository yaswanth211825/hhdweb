import { CheckCircle2, Clock3, HandCoins, ThumbsUp } from "lucide-react"

const features = [
  {
    icon: CheckCircle2,
    title: "Quality Craftsmanship",
    description: "Built with attention to detail, durable materials, and professional execution.",
  },
  {
    icon: Clock3,
    title: "Reliable & On-Time",
    description: "Structured planning and transparent coordination keep every project on schedule.",
  },
  {
    icon: HandCoins,
    title: "Competitive Pricing",
    description: "Practical solutions with clear estimates that fit your budget expectations.",
  },
  {
    icon: ThumbsUp,
    title: "Customer Satisfaction",
    description: "From consultation to handover, we focus on a smooth and satisfying experience.",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
            Trusted Construction Partner for Your Next Project
          </h2>
          <p className="text-muted-foreground">
            We combine experience, quality, and reliability to deliver spaces that match your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-background p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}