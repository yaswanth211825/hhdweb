"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

export function DreamBuilderSection() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    plotArea: "",
    plotWidth: "",
    plotLength: "",
    floors: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (formData.plotArea) params.set("area", formData.plotArea)
    if (formData.plotWidth) params.set("width", formData.plotWidth)
    if (formData.plotLength) params.set("length", formData.plotLength)
    if (formData.floors) params.set("floors", formData.floors)
    router.push(`/floor-plans?${params.toString()}`)
  }

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Start Your Journey
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-4">
              Find the Perfect Plan for Your Plot
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              Enter your plot details and discover floor plans tailored to your exact specifications.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-primary-foreground/10 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="plotArea" className="text-primary-foreground/80">
                  Plot Area (sq ft)
                </Label>
                <Input
                  id="plotArea"
                  type="number"
                  placeholder="e.g., 1500"
                  value={formData.plotArea}
                  onChange={(e) => setFormData({ ...formData, plotArea: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plotWidth" className="text-primary-foreground/80">
                  Plot Width (ft)
                </Label>
                <Input
                  id="plotWidth"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.plotWidth}
                  onChange={(e) => setFormData({ ...formData, plotWidth: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plotLength" className="text-primary-foreground/80">
                  Plot Length (ft)
                </Label>
                <Input
                  id="plotLength"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.plotLength}
                  onChange={(e) => setFormData({ ...formData, plotLength: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floors" className="text-primary-foreground/80">
                  Number of Floors
                </Label>
                <Select
                  value={formData.floors}
                  onValueChange={(value) => setFormData({ ...formData, floors: value })}
                >
                  <SelectTrigger
                    id="floors"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  >
                    <SelectValue placeholder="Select floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Floor</SelectItem>
                    <SelectItem value="2">2 Floors</SelectItem>
                    <SelectItem value="3">3 Floors</SelectItem>
                    <SelectItem value="4">4+ Floors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 h-14"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Floor Plans
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
