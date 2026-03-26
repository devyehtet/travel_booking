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

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function trackPurchase(payload: PurchaseEventPayload) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return
  }

  window.gtag("event", "purchase", payload)
}
