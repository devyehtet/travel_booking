import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ServicesOverview } from "@/components/services-overview"
import { PopularTours } from "@/components/popular-tours"
import { VisaServicesPreview } from "@/components/visa-services-preview"
import { Testimonials } from "@/components/testimonials"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesOverview />
        <PopularTours />
        <VisaServicesPreview />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
