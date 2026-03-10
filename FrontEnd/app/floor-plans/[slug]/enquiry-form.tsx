"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, CheckCircle, Loader2 } from "lucide-react"
import { submitEnquiry } from "@/lib/api"

interface Props {
  projectId: string
  planTitle: string
}

export function EnquiryForm({ projectId, planTitle }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")
    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message || undefined,
        projectId,
      })
      setStatus("success")
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          Enquire About This Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-foreground mb-1">Enquiry Sent!</p>
            <p className="text-sm text-muted-foreground">
              We'll get back to you within 24 hours.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setStatus("idle")}
            >
              Send Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Interested in <span className="font-medium text-foreground">{planTitle}</span>?
              Share your details and our architect will contact you.
            </p>

            <div className="space-y-2">
              <Label htmlFor="eq-name">Full Name *</Label>
              <Input
                id="eq-name"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eq-email">Email *</Label>
              <Input
                id="eq-email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eq-phone">Phone</Label>
              <Input
                id="eq-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eq-message">Your Requirements</Label>
              <Textarea
                id="eq-message"
                placeholder="Tell us about your plot dimensions, preferred location, budget, and any specific requirements…"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Enquiry"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
