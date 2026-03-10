"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingPlaygroundButton() {
  return (
    <Button
      asChild
      size="lg"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110"
    >
      <Link href="/ai-playground" aria-label="Open AI Playground">
        <Pencil className="w-6 h-6" />
      </Link>
    </Button>
  )
}
