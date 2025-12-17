"use server"

import { headers } from "next/headers"
import type { Locale } from "@/lib/translations"

// Myanmar IP ranges (simplified - in production, use a proper geo-IP service)
const MYANMAR_COUNTRY_CODES = ["MM", "MMR"]

export async function detectLocaleFromIP(): Promise<Locale> {
  try {
    const headersList = await headers()

    // Check Vercel's geo headers first (most reliable on Vercel)
    const country = headersList.get("x-vercel-ip-country")

    if (country && MYANMAR_COUNTRY_CODES.includes(country.toUpperCase())) {
      return "mm"
    }

    // Check Cloudflare's geo header as fallback
    const cfCountry = headersList.get("cf-ipcountry")
    if (cfCountry && MYANMAR_COUNTRY_CODES.includes(cfCountry.toUpperCase())) {
      return "mm"
    }

    // Check accept-language header as another fallback
    const acceptLanguage = headersList.get("accept-language") || ""
    if (acceptLanguage.toLowerCase().includes("my") || acceptLanguage.toLowerCase().includes("mm")) {
      return "mm"
    }

    return "en"
  } catch {
    return "en"
  }
}
