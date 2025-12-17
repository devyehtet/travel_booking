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
        <div className="mb-8">
          <p className="text-muted-foreground">{allTours.length} tours available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden group hover:shadow-xl transition-all border-border">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {tour.popular && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Popular</Badge>
                )}
                <Badge variant="secondary" className="absolute top-3 right-3">
                  {tour.region ? tour.region.charAt(0).toUpperCase() + tour.region.slice(1) : "Thailand"}
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {tour.location}
                </div>
                <h3 className="font-serif font-semibold text-xl text-foreground mb-2">{tour.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <p className="font-bold text-primary text-xl">{tour.price}</p>
                  </div>
                  <Button onClick={() => handleBookNow(tour)}>Book Now</Button>
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
