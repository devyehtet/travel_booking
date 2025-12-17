"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, Phone, ArrowRight, MapPin, Mail } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function CTASection() {
  const { locale, t } = useLocale()
  const isMM = locale === "mm"

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/thailand-landscape-panorama-sunset-temples-mountai.jpg"
              alt="Thailand landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/85 to-primary/50" />
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/25 rounded-full blur-3xl" />

          <div className="relative px-8 py-20 md:px-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div
                className={`inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-5 py-2 rounded-full text-sm font-medium mb-8 border border-primary-foreground/15 ${isMM ? "font-myanmar" : ""}`}
              >
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                {isMM ? "ယနေ့ စတင်လိုက်ပါ" : "Get Started Today"}
              </div>

              <h2
                className={`font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-6 leading-tight tracking-tight text-balance ${isMM ? "font-myanmar" : ""}`}
              >
                {t.cta.title}
              </h2>

              <p
                className={`text-lg md:text-xl text-card/75 mb-12 max-w-2xl mx-auto leading-relaxed ${isMM ? "font-myanmar" : ""}`}
              >
                {t.cta.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
                <Button
                  size="lg"
                  className={`text-base px-8 py-6 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl shadow-accent/25 group font-medium ${isMM ? "font-myanmar" : ""}`}
                  asChild
                >
                  <Link href="/contact">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t.cta.startPlanning}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 rounded-full bg-card/10 border-card/25 text-card hover:bg-card/20 hover:text-card backdrop-blur-sm font-medium"
                  asChild
                >
                  <Link href="tel:+66XXXXXXXX">
                    <Phone className="mr-2 h-5 w-5" />
                    {isMM ? "ဖုန်းခေါ်ရန်" : "Call Now"}
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Phone, label: t.footer.phone, value: "+66 XX XXX XXXX" },
                  { icon: Mail, label: t.footer.email, value: "hello@yourborders.com" },
                  { icon: MapPin, label: t.footer.address, value: isMM ? "ဘန်ကောက်၊ ထိုင်း" : "Bangkok, Thailand" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 justify-center bg-card/10 backdrop-blur-sm rounded-xl p-4 border border-card/15"
                  >
                    <item.icon className="h-5 w-5 text-accent" />
                    <div className="text-left">
                      <p className={`text-xs text-card/50 font-medium ${isMM ? "font-myanmar" : ""}`}>{item.label}</p>
                      <p className="text-sm font-medium text-card">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
