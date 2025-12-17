"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { convertPrice } from "@/lib/translations"
import { VisaBookingModal, visaServices } from "./visa-booking-modal"
import type { VisaService } from "./visa-booking-modal"

export function VisaServicesList() {
  const { locale } = useLocale()
  const isMM = locale === "mm"

  const [selectedService, setSelectedService] = useState<VisaService | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleGetStarted = (service: VisaService) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 ${isMM ? "font-myanmar" : ""}`}
          >
            {isMM ? "ကျွန်ုပ်တို့၏ ဗီဇာ ဝန်ဆောင်မှုများ" : "Our Visa Services"}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isMM ? "font-myanmar" : ""}`}>
            {isMM
              ? "မြန်မာနိုင်ငံသားများအတွက် ပြည့်စုံသော လူဝင်မှုကြီးကြပ်ရေး ဖြေရှင်းချက်များ။ သင့်ဘာသာစကားဖြင့် စကားပြောပြီး သင့်လိုအပ်ချက်များကို နားလည်ပါသည်။"
              : "Complete immigration solutions for Myanmar nationals. We speak your language and understand your needs."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visaServices.map((service) => (
            <Card key={service.id} className="border-border hover:shadow-lg transition-shadow relative group">
              {(service.id === "visa-extension" || service.id === "tm-30" || service.id === "90-day-report") && (
                <Badge className="absolute -top-3 left-4 bg-accent text-accent-foreground">
                  {isMM ? "အများဆုံး တောင်းဆိုမှု" : "Most Requested"}
                </Badge>
              )}
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className={`font-serif text-xl ${isMM ? "font-myanmar" : ""}`}>
                  {isMM ? service.titleMM : service.title}
                </CardTitle>
                <CardDescription className={`text-muted-foreground leading-relaxed ${isMM ? "font-myanmar" : ""}`}>
                  {isMM ? service.descriptionMM : service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div>
                    <p className={`text-sm text-muted-foreground ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? "မှ စတင်" : "Starting from"}
                    </p>
                    <p className="font-bold text-primary text-lg">{convertPrice(service.price, locale)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm text-muted-foreground ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? "ကြာချိန်" : "Processing"}
                    </p>
                    <p className={`font-medium text-foreground ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? service.durationMM : service.duration}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className={`text-sm font-medium text-foreground mb-2 ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "ပါဝင်သည့် ဝန်ဆောင်မှုများ" : "Includes"}:
                  </p>
                  <ul className="space-y-1">
                    {(isMM ? service.typesMM : service.types).map((type, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 text-sm text-muted-foreground ${isMM ? "font-myanmar" : ""}`}
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className={`w-full bg-gradient-to-r from-primary to-teal-600 hover:opacity-90 ${isMM ? "font-myanmar" : ""}`}
                  onClick={() => handleGetStarted(service)}
                >
                  {isMM ? "စတင်ရန်" : "Get Started"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Visa Booking Modal */}
      <VisaBookingModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedService(null)
        }}
      />
    </section>
  )
}
