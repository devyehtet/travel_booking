"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { convertPrice } from "@/lib/translations"
import { VisaBookingModal } from "./visa-booking-modal"
import { visaServices, type VisaService } from "@/lib/visa-service-data"

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

        <div className="mb-10 rounded-3xl border border-primary/15 bg-gradient-to-r from-primary/5 via-background to-accent/5 p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.18em] text-primary/80 ${isMM ? "font-myanmar" : ""}`}>
                {isMM ? "ပညာသင် ဗီဇာ update" : "Education Visa Update"}
              </p>
              <h3 className={`mt-1 font-serif text-2xl font-semibold text-foreground ${isMM ? "font-myanmar" : ""}`}>
                {isMM ? "ED Visa နှင့် ED Plus University Visa ကို ฿57,000 မှ စတင်နိုင်ပါပြီ" : "ED Visa and ED Plus University Visa now start from ฿57,000"}
              </h3>
              <p className={`mt-2 text-sm text-muted-foreground ${isMM ? "font-myanmar" : ""}`}>
                {isMM
                  ? "School intake timing, university coordination နှင့် document checklist များကို အစမှ စနစ်တကျ ကူညီပေးပါသည်။"
                  : "We can help with school intake timing, university coordination, and a complete document checklist before you apply."}
              </p>
            </div>
            <div className={`rounded-2xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "Free pre-check available" : "Free pre-check available"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visaServices.map((service) => (
            <Card
              key={service.id}
              className="border-border bg-gradient-to-br from-card via-card to-primary/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
            >
              {service.badge ? (
                <Badge className="absolute -top-3 left-4 bg-accent text-accent-foreground shadow-lg">
                  {isMM ? (service.badgeMM ?? service.badge) : service.badge}
                </Badge>
              ) : null}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-teal-500 to-accent" />
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
                    <p className={`text-xs text-muted-foreground mt-1 ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? service.priceNoteMM : service.priceNote}
                    </p>
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
                  className={`w-full bg-gradient-to-r from-primary via-teal-600 to-accent hover:opacity-95 shadow-lg ${isMM ? "font-myanmar" : ""}`}
                  onClick={() => handleGetStarted(service)}
                >
                  {isMM ? "ဗီဇာ ဝန်ဆောင်မှု တောင်းဆိုရန်" : "Request Visa Service"}
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
