"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, ArrowRight, CheckCircle2, Zap } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { convertPrice } from "@/lib/translations"
import { featuredVisaServices } from "@/lib/visa-service-data"

export function VisaServicesPreview() {
  const { locale, t } = useLocale()
  const isMM = locale === "mm"

  const benefits = [t.visa.legalProcess, t.visa.myanmarStaff, t.visa.fastProcessing, t.visa.affordableRates]

  return (
    <section className="py-28 bg-gradient-to-br from-primary via-primary to-teal-600 text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-400/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary-foreground/5 rounded-full" />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className={`inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 ${isMM ? "font-myanmar" : ""}`}
            >
              <Shield className="h-4 w-4" />
              {t.visa.badge}
            </div>

            <h2
              className={`font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight text-balance ${isMM ? "font-myanmar" : ""}`}
            >
              {t.visa.title}{" "}
              <span className="relative">
                {t.visa.titleHighlight}
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path
                    d="M2 6C50 2 150 2 198 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-accent"
                  />
                </svg>
              </span>
            </h2>

            <p className={`text-xl opacity-90 mb-10 leading-relaxed max-w-lg ${isMM ? "font-myanmar" : ""}`}>
              {t.visa.description}
            </p>

            <div className="space-y-4 mb-10">
              {featuredVisaServices.slice(0, 4).map((service) => (
                <div
                  key={service.title}
                  className="group flex gap-5 p-5 rounded-xl bg-primary-foreground/8 backdrop-blur-sm border border-primary-foreground/15 hover:bg-primary-foreground/15 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary-foreground/15 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <h3 className={`font-semibold text-lg tracking-tight ${isMM ? "font-myanmar" : ""}`}>
                        {isMM ? service.titleMM : service.title}
                      </h3>
                      <span className={`text-sm font-bold text-accent shrink-0 ${isMM ? "font-myanmar" : ""}`}>
                        {t.common.from} {convertPrice(service.price, locale)}
                      </span>
                    </div>
                    <p className={`text-sm opacity-80 mb-2 leading-relaxed ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? service.descriptionMM : service.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Zap className="h-3.5 w-3.5 text-accent" />
                      <span className={`opacity-75 font-medium ${isMM ? "font-myanmar" : ""}`}>
                        {isMM ? service.durationMM : service.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className={`rounded-full px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl group font-medium ${isMM ? "font-myanmar" : ""}`}
              asChild
            >
              <Link href="/visa-services">
                {t.visa.viewAllServices}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/thailand-immigration-office-professional-modern-pa.jpg"
                  alt="Professional visa services"
                  className="w-full h-[420px] object-cover"
                />
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-card text-card-foreground p-5 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Shield className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-3xl text-foreground tracking-tight">100%</p>
                    <p className={`text-sm text-muted-foreground ${isMM ? "font-myanmar" : ""}`}>{t.hero.legalSafe}</p>
                  </div>
                </div>
              </div>

              {/* Benefits card */}
              <div className="absolute -top-4 -right-4 bg-card text-card-foreground p-4 rounded-xl shadow-xl">
                <p className={`font-semibold text-foreground mb-3 text-sm ${isMM ? "font-myanmar" : ""}`}>
                  {t.visa.whyChooseUs}
                </p>
                <div className="space-y-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className={isMM ? "font-myanmar" : ""}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
