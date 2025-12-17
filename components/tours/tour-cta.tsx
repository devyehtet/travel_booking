import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, MessageCircle } from "lucide-react"

export function TourCTA() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Need a Custom Tour Package?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Want to visit multiple cities or need a personalized itinerary? Our team can create a custom tour package just
          for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/contact">
              <MessageCircle className="mr-2 h-5 w-5" />
              Request Custom Tour
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent" asChild>
            <Link href="/contact">
              <Users className="mr-2 h-5 w-5" />
              Group Booking Inquiry
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
