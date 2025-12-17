import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TourHero } from "@/components/tours/tour-hero"
import { TourFilters } from "@/components/tours/tour-filters"
import { TourGrid } from "@/components/tours/tour-grid"
import { TourCTA } from "@/components/tours/tour-cta"

export const metadata = {
  title: "Tour Packages - ThaiMyanmar Travel",
  description:
    "Explore Thailand with our curated tour packages. From Bangkok to Phuket, Chiang Mai to Krabi - discover all Thai destinations with Myanmar-speaking guides.",
}

export default function ToursPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <TourHero />
        <TourFilters />
        <TourGrid />
        <TourCTA />
      </main>
      <Footer />
    </div>
  )
}
