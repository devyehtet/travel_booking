import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VisaHero } from "@/components/visa/visa-hero"
import { VisaServicesList } from "@/components/visa/visa-services-list"
import { VisaProcess } from "@/components/visa/visa-process"
import { VisaFAQ } from "@/components/visa/visa-faq"
import { VisaCTA } from "@/components/visa/visa-cta"

export const metadata = {
  title: "Visa Services - ThaiMyanmar Travel",
  description:
    "Complete visa services for Myanmar nationals in Thailand. VISA extension, TM-30 report, 90 Day Report, Work Permit assistance and more.",
}

export default function VisaServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <VisaHero />
        <VisaServicesList />
        <VisaProcess />
        <VisaFAQ />
        <VisaCTA />
      </main>
      <Footer />
    </div>
  )
}
