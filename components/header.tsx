"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, Phone, Globe, Check, Search } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { locale, setLocale, t } = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: t.header.home },
    { href: "/tours", label: t.header.tours },
    { href: "/visa-services", label: t.header.visaServices },
    { href: "/contact", label: t.header.contact },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-card/95 backdrop-blur-xl shadow-lg shadow-foreground/5" : "bg-transparent"
      }`}
    >
      <div
        className={`bg-foreground text-background py-2 transition-all duration-300 ${
          isScrolled ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <p className={`font-medium tracking-wide ${locale === "mm" ? "font-myanmar" : ""}`}>{t.header.support}</p>
          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-80">
              <MapPin className="h-3.5 w-3.5" />
              {t.header.location}
            </span>
            <span className="flex items-center gap-1.5 opacity-80">
              <Phone className="h-3.5 w-3.5" />
              +66 XX XXX XXXX
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 py-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-lg tracking-tight">YB</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-serif font-bold text-xl tracking-tight transition-colors ${
                  isScrolled ? "text-foreground" : "text-card"
                }`}
              >
                Your Borders
              </span>
              <span
                className={`text-[11px] font-medium uppercase tracking-widest -mt-0.5 transition-colors ${
                  isScrolled ? "text-muted-foreground" : "text-card/60"
                }`}
              >
                Travel & Visa
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-full text-[15px] font-medium transition-all ${locale === "mm" ? "font-myanmar" : ""} ${
                  isScrolled
                    ? "text-foreground/80 hover:text-foreground hover:bg-muted"
                    : "text-card/80 hover:text-card hover:bg-card/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full font-medium gap-2 ${locale === "mm" ? "font-myanmar" : ""} ${
                isScrolled ? "text-foreground/70 hover:bg-muted" : "text-card/80 hover:bg-card/10"
              }`}
              asChild
            >
              <Link href="/booking/lookup">
                <Search className="h-4 w-4" />
                {t.header.trackBooking}
              </Link>
            </Button>

            {/* Language Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full font-medium gap-2 ${
                    isScrolled ? "text-foreground/70 hover:bg-muted" : "text-card/80 hover:bg-card/10"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  {locale === "mm" ? "မြန်မာ" : "EN"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem onClick={() => setLocale("en")} className="flex items-center justify-between">
                  <span>English</span>
                  {locale === "en" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocale("mm")}
                  className="flex items-center justify-between font-myanmar"
                >
                  <span>မြန်မာ</span>
                  {locale === "mm" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              className={`rounded-full px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg shadow-primary/20 ${locale === "mm" ? "font-myanmar" : ""}`}
              asChild
            >
              <Link href="/tours">{t.header.bookTour}</Link>
            </Button>
          </div>

          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-foreground" : "text-card"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50 bg-card rounded-2xl mb-4 px-4 shadow-xl">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-foreground hover:text-primary hover:bg-primary/5 transition-all font-medium px-4 py-3 rounded-xl ${locale === "mm" ? "font-myanmar" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking/lookup"
                className={`text-foreground hover:text-primary hover:bg-primary/5 transition-all font-medium px-4 py-3 rounded-xl flex items-center gap-2 ${locale === "mm" ? "font-myanmar" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                {t.header.trackBooking}
              </Link>
              <div className="flex gap-3 pt-4 mt-3 border-t border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 rounded-full gap-2 bg-transparent">
                      <Globe className="h-4 w-4" />
                      {locale === "mm" ? "မြန်မာ" : "English"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-[140px]">
                    <DropdownMenuItem onClick={() => setLocale("en")} className="flex items-center justify-between">
                      <span>English</span>
                      {locale === "en" && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setLocale("mm")}
                      className="flex items-center justify-between font-myanmar"
                    >
                      <span>မြန်မာ</span>
                      {locale === "mm" && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  className={`flex-1 rounded-full bg-gradient-to-r from-primary to-primary/80 ${locale === "mm" ? "font-myanmar" : ""}`}
                  asChild
                >
                  <Link href="/tours">{t.header.bookTour}</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
