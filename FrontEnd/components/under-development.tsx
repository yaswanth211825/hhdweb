import Link from "next/link"
import { HardHat, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UnderDevelopmentProps {
  title?: string
  description?: string
}

export function UnderDevelopment({
  title = "Coming Soon",
  description = "We're working hard to bring you something great. Check back soon!",
}: UnderDevelopmentProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
        <HardHat className="w-10 h-10 text-accent" />
      </div>
      <h2 className="font-serif text-3xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-8">{description}</p>
      <Button asChild variant="outline">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </Button>
    </div>
  )
}
