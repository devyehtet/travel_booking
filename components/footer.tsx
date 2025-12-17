"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocale } from "@/lib/locale-context"

export function Footer() {
  const { locale, t } = useLocale()
  const isMM = locale === "mm"

  const quickLinks = [
    { label: t.header.tours, href: "/tours" },
    { label: t.footer.visaServices, href: "/visa-services" },
    { label: t.footer.aboutUs, href: "/about" },
    { label: t.header.contact, href: "/contact" },
    { label: t.footer.faqs, href: "/faqs" },
  ]

  const visaServices = [
    t.footer.visaExtension,
    t.footer.tmReport,
    t.footer.ninetyDayReport,
    t.footer.workPermit,
    t.footer.educationVisa,
    t.footer.familyVisa,
  ]

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Newsletter */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
              <h3 className={`font-serif text-2xl font-bold mb-2 tracking-tight ${isMM ? "font-myanmar" : ""}`}>
                {t.footer.newsletter}
              </h3>
              <p className={`text-background/60 text-[15px] ${isMM ? "font-myanmar" : ""}`}>
                {t.footer.newsletterDesc}
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto max-w-md">
              <Input
                placeholder={t.footer.emailPlaceholder}
                className={`bg-background/10 border-background/15 text-background placeholder:text-background/40 rounded-full ${isMM ? "font-myanmar" : ""}`}
              />
              <Button
                className={`rounded-full px-6 bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 font-medium ${isMM ? "font-myanmar" : ""}`}
              >
                {t.footer.subscribe}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">YB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl tracking-tight">Your Borders</span>
                <span className="text-[10px] text-background/40 uppercase tracking-widest">Travel & Visa</span>
              </div>
            </div>
            <p className={`text-background/60 leading-relaxed mb-6 text-[15px] ${isMM ? "font-myanmar" : ""}`}>
              {t.footer.brandDesc}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 hover:bg-[#00B900] rounded-full flex items-center justify-center transition-colors"
                aria-label="Line"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-serif font-bold text-lg mb-6 flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
              <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded" />
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-background/60 hover:text-primary transition-colors flex items-center gap-2 group text-[15px] ${isMM ? "font-myanmar" : ""}`}
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visa Services */}
          <div>
            <h4 className={`font-serif font-bold text-lg mb-6 flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
              <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded" />
              {t.footer.visaServices}
            </h4>
            <ul className="space-y-3.5">
              {visaServices.map((service) => (
                <li
                  key={service}
                  className={`text-background/60 flex items-center gap-2.5 text-[15px] ${isMM ? "font-myanmar" : ""}`}
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-serif font-bold text-lg mb-6 flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
              <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded" />
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className={`text-xs text-background/40 mb-0.5 font-medium ${isMM ? "font-myanmar" : ""}`}>
                    {t.footer.address}
                  </p>
                  <p className={`text-background/80 text-[15px] ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "ဘန်ကောက်၊ ထိုင်း" : "Bangkok, Thailand"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className={`text-xs text-background/40 mb-0.5 font-medium ${isMM ? "font-myanmar" : ""}`}>
                    {t.footer.phone}
                  </p>
                  <p className="text-background/80 text-[15px]">+66 XX XXX XXXX</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className={`text-xs text-background/40 mb-0.5 font-medium ${isMM ? "font-myanmar" : ""}`}>
                    {t.footer.email}
                  </p>
                  <p className="text-background/80 text-[15px]">hello@yourborders.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`border-t border-background/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-background/40 text-sm ${isMM ? "font-myanmar" : ""}`}
        >
          <p>
            &copy; {new Date().getFullYear()} Your Borders. {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              {t.footer.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
