import { Building, Home, FileText, Award } from "lucide-react"

const stats = [
  {
    icon: Award,
    value: "10+",
    label: "Years of Experience",
  },
  {
    icon: Building,
    value: "250+",
    label: "Projects Delivered",
  },
  {
    icon: FileText,
    value: "100+",
    label: "Renovations Completed",
  },
  {
    icon: Home,
    value: "98%",
    label: "Client Satisfaction",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
