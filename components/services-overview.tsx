"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plane, FileText, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function ServicesOverview() {
  const { locale, t } = useLocale()
  const isMM = locale === "mm"

  const services = [
    {
      icon: Plane,
      title: t.services.tourPackages,
      description: t.services.tourPackagesDesc,
      href: "/tours",
      features: [t.services.allMajorCities, t.services.privateGroupTours, t.services.myanmarGuides],
      color: "from-primary to-teal-500",
      bgColor: "bg-primary/8",
    },
    {
      icon: FileText,
      title: t.services.visaExtensions,
      description: t.services.visaExtensionsDesc,
      href: "/visa-services",
      features: [t.services.touristVisa, t.services.nonImmigrant, t.services.educationVisa],
      color: "from-accent to-orange-400",
      bgColor: "bg-accent/8",
    },
    {
      icon: Clock,
      title: t.services.tmReport,
      description: t.services.tmReportDesc,
      href: "/visa-services",
      features: [t.services.tmReports, t.services.ninetyDayReports, t.services.sameDayService],
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/8",
    },
  ]

  const trustIndicators = [
    t.services.licensedAgent,
    t.services.myanmarStaff,
    t.services.yearsExperience,
    t.services.satisfaction,
  ]

  return (
    <section className="py-28 bg-muted/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-5 ${isMM ? "font-myanmar" : ""}`}
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            {t.services.badge}
          </div>
          <h2
            className={`font-serif text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight text-balance ${isMM ? "font-myanmar" : ""}`}
          >
            {t.services.title} <span className="text-gradient">{t.services.titleHighlight}</span>
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isMM ? "font-myanmar" : ""}`}
          >
            {t.services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative bg-card rounded-2xl p-8 border border-border/60 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`}
              />

              <div
                className={`relative w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <service.icon className="h-7 w-7 text-primary relative z-10 group-hover:text-primary-foreground transition-colors duration-300" />
              </div>

              <h3
                className={`font-serif text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors ${isMM ? "font-myanmar" : ""}`}
              >
                {service.title}
              </h3>
              <p className={`text-muted-foreground mb-6 leading-relaxed text-[15px] ${isMM ? "font-myanmar" : ""}`}>
                {service.description}
              </p>

              <ul className="space-y-2.5 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className={`text-sm font-medium ${isMM ? "font-myanmar" : ""}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className={`w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all text-sm font-medium bg-transparent ${isMM ? "font-myanmar" : ""}`}
                asChild
              >
                <Link href={service.href}>
                  {t.services.learnMore}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground">
          {trustIndicators.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className={`text-sm font-medium ${isMM ? "font-myanmar" : ""}`}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
