"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { type Locale, translations, convertPrice } from "./translations"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof translations.en
  isLoading: boolean
  formatPrice: (price: string | number) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children, detectedLocale }: { children: ReactNode; detectedLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(detectedLocale || "en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage first for user preference
    const savedLocale = localStorage.getItem("preferred-locale") as Locale | null
    if (savedLocale && (savedLocale === "en" || savedLocale === "mm")) {
      setLocaleState(savedLocale)
    } else if (detectedLocale) {
      setLocaleState(detectedLocale)
    }
    setIsLoading(false)
  }, [detectedLocale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("preferred-locale", newLocale)
  }

  const t = translations[locale]

  const formatPrice = useCallback(
    (price: string | number) => {
      return convertPrice(price, locale)
    },
    [locale],
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isLoading, formatPrice }}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
