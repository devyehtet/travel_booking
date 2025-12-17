"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle } from "lucide-react"

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="border-border">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Thank You!</h3>
          <p className="text-muted-foreground mb-2">ကျေးဇူးတင်ပါတယ်။ သင့်ရဲ့ message ကို လက်ခံရရှိပါပြီ။</p>
          <p className="text-muted-foreground">Our team will contact you within 24 hours.</p>
          <Button className="mt-6" onClick={() => setIsSubmitted(false)}>
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Send Us a Message</CardTitle>
        <CardDescription>Fill out the form below and we will get back to you soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Your first name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Your last name" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone / Line / Viber</Label>
            <Input id="phone" placeholder="+66 XX XXX XXXX" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <select
              id="service"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select a service</option>
              <optgroup label="Tour Packages">
                <option value="tour-bangkok">Bangkok Tour</option>
                <option value="tour-phuket">Phuket Tour</option>
                <option value="tour-chiangmai">Chiang Mai Tour</option>
                <option value="tour-custom">Custom Tour Package</option>
              </optgroup>
              <optgroup label="Visa Services">
                <option value="visa-extension">VISA Extension</option>
                <option value="tm30">TM-30 Report</option>
                <option value="90day">90 Day Report</option>
                <option value="work-permit">Work Permit</option>
              </optgroup>
              <option value="other">Other Inquiry</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Tell us about your needs... (English or Myanmar)" rows={5} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="language" value="myanmar" className="text-primary" defaultChecked />
                <span className="text-foreground">မြန်မာ</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="language" value="english" className="text-primary" />
                <span className="text-foreground">English</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="language" value="thai" className="text-primary" />
                <span className="text-foreground">ไทย</span>
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Send className="mr-2 h-5 w-5" />
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
