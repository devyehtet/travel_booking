"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, MapPin, Users, Star } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { convertPrice } from "@/lib/translations"

export function HeroSection() {
  const { locale, t } = useLocale()
  const isMM = locale === "mm"

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: `url('/beautiful-thailand-beach-sunset-with-temples-golde.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/70 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-transparent to-transparent" />
      </div>

      <div className="absolute top-32 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float-slow" />

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2.5 bg-card/15 backdrop-blur-md text-card px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-card/20 animate-slide-up ${isMM ? "font-myanmar" : ""}`}
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              {t.hero.badge}
            </div>

            <h1
              className={`font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-card mb-8 leading-[1.08] tracking-tight text-balance animate-slide-up ${isMM ? "font-myanmar" : ""}`}
              style={{ animationDelay: "0.1s" }}
            >
              {t.hero.title1}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-accent via-accent to-primary bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent/25 -z-0 rounded-sm" />
              </span>
              , <br className="hidden md:block" />
              {t.hero.title2}
            </h1>

            <p
              className={`text-lg md:text-xl text-card/75 mb-10 leading-relaxed max-w-xl animate-slide-up ${isMM ? "font-myanmar" : ""}`}
              style={{ animationDelay: "0.2s" }}
            >
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button
                size="lg"
                className={`text-base px-8 py-6 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl shadow-accent/25 group ${isMM ? "font-myanmar" : ""}`}
                asChild
              >
                <Link href="/tours">
                  {t.hero.exploreTours}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`text-base px-8 py-6 rounded-full bg-card/10 border-card/25 text-card hover:bg-card/20 hover:text-card backdrop-blur-sm ${isMM ? "font-myanmar" : ""}`}
                asChild
              >
                <Link href="/visa-services">
                  <Shield className="mr-2 h-5 w-5" />
                  {t.hero.visaServices}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              {[
                { icon: MapPin, value: "20+", label: t.hero.destinations },
                { icon: Shield, value: "100%", label: t.hero.legalSafe },
                { icon: Users, value: "5,000+", label: t.hero.happyTravelers },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-dark rounded-2xl p-4 text-center hover:bg-card/15 transition-all cursor-default group"
                >
                  <stat.icon className="h-5 w-5 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-bold text-card tracking-tight">{stat.value}</p>
                  <p className={`text-xs text-card/60 font-medium ${isMM ? "font-myanmar" : ""}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main featured card */}
              <div className="glass rounded-3xl p-2 shadow-2xl animate-float">
                <img
                  src="/phuket-beach-paradise-thailand-aerial-view-crystal.jpg"
                  alt="Phuket Paradise Beach"
                  className="w-full h-80 object-cover rounded-2xl"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent ring-2 ring-card"
                        />
                      ))}
                    </div>
                    <span className={`text-sm text-muted-foreground font-medium ${isMM ? "font-myanmar" : ""}`}>
                      2.5k+ {t.hero.booked}
                    </span>
                  </div>
                  <h3
                    className={`font-serif font-bold text-lg text-foreground tracking-tight ${isMM ? "font-myanmar" : ""}`}
                  >
                    {t.hero.featuredTour}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-semibold text-foreground">4.9</span>
                      <span className="text-muted-foreground text-sm">(128)</span>
                    </div>
                    <div className={`text-right ${isMM ? "font-myanmar" : ""}`}>
                      <span className="text-xs text-muted-foreground">{t.hero.from}</span>
                      <span className="font-bold text-primary ml-1">{convertPrice("฿12,000", locale)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating testimonial card */}
              <div className="absolute -bottom-6 -left-12 glass rounded-2xl p-4 shadow-xl max-w-xs animate-float-slow">
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className={`text-sm text-foreground font-medium mb-2 ${isMM ? "font-myanmar" : ""}`}>
                  "{t.hero.testimonial}"
                </p>
                <p className={`text-xs text-muted-foreground ${isMM ? "font-myanmar" : ""}`}>
                  — {t.hero.testimonialAuthor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-card/50">
        <span
          className={`text-xs uppercase tracking-[0.2em] font-medium ${isMM ? "font-myanmar tracking-normal" : ""}`}
        >
          {t.hero.scroll}
        </span>
        <div className="w-5 h-9 border-2 border-card/25 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2.5 bg-card/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
