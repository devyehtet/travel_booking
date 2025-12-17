import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, Phone, MapPin } from "lucide-react"

export function VisaCTA() {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Need Visa Help Today?</h2>
            <p className="text-lg opacity-80 mb-8 leading-relaxed">
              Our Myanmar-speaking team is ready to assist you with any visa or immigration needs. Contact us for a free
              consultation.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Call us</p>
                  <p className="font-medium">+66 XX XXX XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Line / Viber</p>
                  <p className="font-medium">@thaimyanmar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Office Location</p>
                  <p className="font-medium">Bangkok, Thailand</p>
                </div>
              </div>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Us Now
              </Link>
            </Button>
          </div>
          <div className="bg-background/10 rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-bold mb-6">Quick Inquiry</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-primary"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-primary"
              />
              <select className="w-full px-4 py-3 rounded-lg bg-background/10 border border-background/20 text-background focus:outline-none focus:border-primary">
                <option value="" className="text-foreground">
                  Select Service
                </option>
                <option value="visa-extension" className="text-foreground">
                  VISA Extension
                </option>
                <option value="tm30" className="text-foreground">
                  TM-30 Report
                </option>
                <option value="90day" className="text-foreground">
                  90 Day Report
                </option>
                <option value="work-permit" className="text-foreground">
                  Work Permit
                </option>
                <option value="other" className="text-foreground">
                  Other
                </option>
              </select>
              <Button type="submit" className="w-full" size="lg">
                Send Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
