"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackEvent } from "@/lib/gtag"

const FIRST_VISIT_STORAGE_KEY = "yb:first_visit_tracked"
const SESSION_START_STORAGE_KEY = "yb:session_start_tracked"

function buildPageEventParams(pagePath: string) {
  return {
    page_location: window.location.href,
    page_path: pagePath,
    page_title: document.title,
  }
}

export function GtagAutoEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedPageRef = useRef<string | null>(null)

  useEffect(() => {
    const search = searchParams.toString()
    const pagePath = search ? `${pathname}?${search}` : pathname

    try {
      if (!localStorage.getItem(FIRST_VISIT_STORAGE_KEY)) {
        trackEvent("first_visit", buildPageEventParams(pagePath))
        localStorage.setItem(FIRST_VISIT_STORAGE_KEY, new Date().toISOString())
      }

      if (!sessionStorage.getItem(SESSION_START_STORAGE_KEY)) {
        trackEvent("session_start", buildPageEventParams(pagePath))
        sessionStorage.setItem(SESSION_START_STORAGE_KEY, new Date().toISOString())
      }
    } catch {
      // Ignore storage access failures and still try to send the current page view.
    }

    if (lastTrackedPageRef.current === pagePath) {
      return
    }

    trackEvent("page_view", buildPageEventParams(pagePath))
    lastTrackedPageRef.current = pagePath
  }, [pathname, searchParams])

  return null
}
