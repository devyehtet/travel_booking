export const TOUR_BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const
export const VISA_BOOKING_STATUSES = ["pending", "processing", "completed", "cancelled"] as const

export type TourBookingStatus = (typeof TOUR_BOOKING_STATUSES)[number]
export type VisaBookingStatus = (typeof VISA_BOOKING_STATUSES)[number]

export interface BookingData {
  bookingType: "tour"
  id: string
  tourId: number
  tourTitle: string
  tourLocation: string
  tourDuration: string
  tourPrice: number
  totalPrice: number
  currency: "THB"
  fullName: string
  email: string
  phone: string
  nationality: string
  numberOfGuests: number
  travelDate: string
  specialRequests?: string
  preferredLanguage: string
  createdAt: string
  status: TourBookingStatus
}

export interface VisaBookingData {
  bookingType: "visa"
  id: string
  serviceType: string
  serviceTitle: string
  servicePrice: number
  currency: "THB"
  fullName: string
  email: string
  phone: string
  nationality: string
  passportNumber: string
  currentVisaType: string
  visaType: string
  visaExpiryDate: string
  currentAddress: string
  preferredDate: string
  additionalNotes?: string
  preferredLanguage: string
  createdAt: string
  status: VisaBookingStatus
}

export type StoredBooking = BookingData | VisaBookingData

function buildBookingId(prefix: "BK" | "VS") {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export function generateBookingId() {
  return buildBookingId("BK")
}

export function generateVisaBookingId() {
  return buildBookingId("VS")
}

export function isTourBooking(booking: StoredBooking): booking is BookingData {
  return booking.bookingType === "tour"
}

export function isVisaBooking(booking: StoredBooking): booking is VisaBookingData {
  return booking.bookingType === "visa"
}

export function formatStoredPrice(amount: number, currency: "THB" = "THB") {
  if (currency === "THB") {
    return `฿${amount.toLocaleString()}`
  }

  return amount.toLocaleString()
}
