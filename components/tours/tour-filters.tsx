"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const regions = [
  { id: "all", label: "All Regions" },
  { id: "central", label: "Central" },
  { id: "north", label: "North" },
  { id: "south", label: "South" },
  { id: "east", label: "East" },
  { id: "northeast", label: "Northeast" },
]

const durations = [
  { id: "all", label: "Any Duration" },
  { id: "1-2", label: "1-2 Days" },
  { id: "3-4", label: "3-4 Days" },
  { id: "5+", label: "5+ Days" },
]

export function TourFilters() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState("all")

  return (
    <section className="py-8 bg-muted border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <Button
                key={region.id}
                variant={selectedRegion === region.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region.id)}
                className={selectedRegion !== region.id ? "bg-transparent" : ""}
              >
                {region.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {durations.map((duration) => (
              <Button
                key={duration.id}
                variant={selectedDuration === duration.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedDuration(duration.id)}
              >
                {duration.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
