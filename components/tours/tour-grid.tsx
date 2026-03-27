"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, MapPin } from "lucide-react"
import { allTours, type Tour } from "@/lib/tour-data"
import { BookingModal } from "@/components/booking/booking-modal"

export function TourGrid() {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleBookNow = (tour: Tour) => {
    setSelectedTour(tour)
    setIsBookingOpen(true)
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary/70 font-medium">Curated Routes</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              {allTours.length} refreshed Thailand tour packages
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Updated starting prices, clearer inclusions, and faster-to-scan cards so customers can compare options
              with more confidence.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Most popular</p>
              <p className="text-lg font-semibold">{allTours.filter((tour) => tour.popular).length} routes</p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">Regions covered</p>
              <p className="text-lg font-semibold">
                {new Set(allTours.map((tour) => tour.region).filter(Boolean)).size} regions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allTours.map((tour) => (
            <Card
              key={tour.id}
              className="group overflow-hidden border-border bg-gradient-to-br from-card via-card to-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {tour.popular ? (
                  <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">Popular</Badge>
                ) : null}
                <Badge variant="secondary" className="absolute right-3 top-3 shadow-sm">
                  {tour.region ? tour.region.charAt(0).toUpperCase() + tour.region.slice(1) : "Thailand"}
                </Badge>
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {tour.location}
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">{tour.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{tour.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tour.highlights?.slice(0, 3).map((highlight) => (
                    <span key={highlight} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {tour.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {tour.groupSize} people
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    {tour.rating}
                  </span>
                  <span className="truncate">{tour.idealFor ?? "Flexible travelers"}</span>
                </div>

                <div className="rounded-2xl bg-muted/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Includes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tour.includes?.slice(0, 3).map((item) => (
                      <span key={item} className="rounded-full border border-border bg-background px-3 py-1 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    {tour.originalPrice ? <p className="text-sm text-muted-foreground line-through">{tour.originalPrice}</p> : null}
                    <p className="text-xl font-bold text-primary">{tour.price}</p>
                    {tour.priceNote ? <p className="mt-1 text-xs text-muted-foreground">{tour.priceNote}</p> : null}
                  </div>
                  <Button className="shadow-lg" onClick={() => handleBookNow(tour)}>
                    Book Now
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
