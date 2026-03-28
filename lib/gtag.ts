interface PurchaseItem {
  item_id: string
  item_name: string
  item_category?: string
  item_variant?: string
  price?: number
  quantity?: number
}

interface PurchaseEventPayload {
  transaction_id: string
  value: number
  currency: string
  items?: PurchaseItem[]
}

interface AdsConversionEventPayload {
  send_to: string
  value: number
  currency: string
}

type GtagEventParams = object

const TRAVEL_BOOKING_CONVERSION_DESTINATION = "AW-17353057075/vyGsCNjQjpEcELPGytJA"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function trackPurchase(payload: PurchaseEventPayload) {
  trackEvent("purchase", payload)
}

export function trackTravelBookingLeadConversion(
  payload: Partial<Omit<AdsConversionEventPayload, "send_to">> = {},
) {
  trackEvent("conversion", {
    send_to: TRAVEL_BOOKING_CONVERSION_DESTINATION,
    value: payload.value ?? 1,
    currency: payload.currency ?? "THB",
  })
}

export function trackEvent(eventName: string, parameters: GtagEventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return
  }

  window.gtag("event", eventName, parameters)
}
