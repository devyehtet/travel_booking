"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Clock, Users, Star, MapPin, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { popularTours, type Tour } from "@/lib/tour-data"
import { BookingModal } from "@/components/booking/booking-modal"
import { useLocale } from "@/lib/locale-context"
import { tourTranslations, locationTranslations, convertPrice } from "@/lib/translations"

export function PopularTours() {
  const [hoveredTour, setHoveredTour] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { locale, t } = useLocale()
  const isMM = locale === "mm"

  const handleBookNow = (tour: Tour) => {
    setSelectedTour(tour)
    setIsBookingOpen(true)
  }

  const getTranslatedTourName = (title: string) => {
    return tourTranslations[locale][title as keyof typeof tourTranslations.en] || title
  }

  const getTranslatedLocation = (location: string) => {
    return locationTranslations[locale][location as keyof typeof locationTranslations.en] || location
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2300b4b4' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <div
              className={`inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4 ${isMM ? "font-myanmar" : ""}`}
            >
              <Star className="h-4 w-4 fill-accent" />
              {t.tours.badge}
            </div>
            <h2
              className={`font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 ${isMM ? "font-myanmar" : ""}`}
            >
              {t.tours.title} <span className="text-gradient">{t.tours.titleHighlight}</span>
            </h2>
            <p className={`text-lg text-muted-foreground max-w-xl ${isMM ? "font-myanmar" : ""}`}>
              {t.tours.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-transparent">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className={`rounded-full ml-2 bg-transparent ${isMM ? "font-myanmar" : ""}`}
              asChild
            >
              <Link href="/tours">
                {t.tours.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTours.map((tour) => (
            <Card
              key={tour.id}
              className="overflow-hidden group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card"
              onMouseEnter={() => setHoveredTour(tour.id)}
              onMouseLeave={() => setHoveredTour(null)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={getTranslatedTourName(tour.title)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {tour.tag && (
                  <Badge
                    className={`absolute top-4 left-4 ${
                      tour.tag === "Best Seller"
                        ? "bg-gradient-to-r from-primary to-accent"
                        : tour.tag === "Top Rated"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-accent"
                    } text-primary-foreground border-0 shadow-lg`}
                  >
                    {tour.tag}
                  </Badge>
                )}

                <button className="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card hover:scale-110">
                  <Heart className="h-5 w-5 text-foreground hover:text-red-500 transition-colors" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <Button
                    size="sm"
                    className={`w-full rounded-full bg-card/90 text-foreground hover:bg-card backdrop-blur-sm ${isMM ? "font-myanmar" : ""}`}
                  >
                    {t.tours.quickView}
                  </Button>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex items-center gap-1.5 text-sm text-muted-foreground ${isMM ? "font-myanmar" : ""}`}
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    {getTranslatedLocation(tour.location)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold text-sm">{tour.rating}</span>
                    <span className="text-xs text-muted-foreground">({tour.reviews})</span>
                  </div>
                </div>

                <h3
                  className={`font-serif font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1 ${isMM ? "font-myanmar" : ""}`}
                >
                  {getTranslatedTourName(tour.title)}
                </h3>

                <div
                  className={`flex items-center gap-4 text-sm text-muted-foreground mb-5 ${isMM ? "font-myanmar" : ""}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {tour.duration.replace("Days", t.tours.days).replace("Day", t.tours.day)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {tour.groupSize}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className={isMM ? "font-myanmar" : ""}>
                    {tour.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {convertPrice(tour.originalPrice, locale)}
                      </span>
                    )}
                    <p className="font-bold text-xl text-primary">{convertPrice(tour.price, locale)}</p>
                  </div>
                  <Button
                    size="sm"
                    className={`rounded-full px-5 bg-gradient-to-r from-primary to-accent hover:opacity-90 ${isMM ? "font-myanmar" : ""}`}
                    onClick={() => handleBookNow(tour)}
                  >
                    {t.tours.bookNow}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BookingModal tour={selectedTour} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </section>
  )
}
