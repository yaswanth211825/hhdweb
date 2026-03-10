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
import { Send } from "lucide-react"

export function DreamBuilderSection() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (formData.name) params.set("name", formData.name)
    if (formData.phone) params.set("phone", formData.phone)
    if (formData.service) params.set("service", formData.service)
    if (formData.location) params.set("location", formData.location)
    router.push(`/contact?${params.toString()}`)
  }

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Free Consultation
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-4">
              Quick Enquiry Form
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              Tell us what you need and our team will contact you shortly to discuss your project.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-primary-foreground/10 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-primary-foreground/80">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Rohan Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-primary-foreground/80">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +91 97016 65847"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-primary-foreground/80">
                  Project Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Bengaluru"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service" className="text-primary-foreground/80">
                  Service Needed
                </Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger
                    id="service"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                  >
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential-construction">Residential Construction</SelectItem>
                    <SelectItem value="commercial-projects">Commercial Projects</SelectItem>
                    <SelectItem value="renovation-remodeling">Renovations & Remodeling</SelectItem>
                    <SelectItem value="custom-builds">Custom Builds</SelectItem>
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
                <Send className="w-5 h-5 mr-2" />
                Send Quick Enquiry
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
