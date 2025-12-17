// Booking types for client and server
export interface BookingData {
  id: string
  tourId: number
  tourTitle: string
  tourPrice: string
  fullName: string
  email: string
  phone: string
  nationality: string
  numberOfGuests: number
  travelDate: string
  specialRequests?: string
  preferredLanguage: string
  createdAt: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
}

export interface VisaBookingData {
  id: string
  serviceType: string
  serviceTitle: string
  servicePrice: string
  fullName: string
  email: string
  phone: string
  nationality: string
  passportNumber: string
  currentVisaType: string
  visaExpiryDate: string
  currentAddress: string
  preferredDate: string
  additionalNotes?: string
  preferredLanguage: string
  createdAt: string
  status: "pending" | "processing" | "completed" | "cancelled"
}

// Client-side storage utilities
const STORAGE_KEY = "yourborders_bookings"
const VISA_STORAGE_KEY = "yourborders_visa_bookings"

export function getBookingsFromStorage(): BookingData[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveBookingsToStorage(bookings: BookingData[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
    window.dispatchEvent(new CustomEvent("bookings-updated", { detail: bookings }))
  } catch (error) {
    console.error("Failed to save bookings:", error)
  }
}

export function addBookingToStorage(booking: BookingData) {
  const bookings = getBookingsFromStorage()
  bookings.unshift(booking)
  saveBookingsToStorage(bookings)
  return booking
}

export function getAllBookings(): BookingData[] {
  return getBookingsFromStorage()
}

export function getBookingByIdFromStorage(id: string): BookingData | undefined {
  const bookings = getBookingsFromStorage()
  return bookings.find((b) => b.id.toUpperCase() === id.toUpperCase())
}

export function updateBookingStatusInStorage(id: string, status: BookingData["status"]) {
  const bookings = getBookingsFromStorage()
  const index = bookings.findIndex((b) => b.id === id)
  if (index !== -1) {
    bookings[index].status = status
    saveBookingsToStorage(bookings)
    return bookings[index]
  }
  return null
}

export function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `YB${timestamp}${random}`
}

export function getVisaBookingsFromStorage(): VisaBookingData[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(VISA_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveVisaBookingsToStorage(bookings: VisaBookingData[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(VISA_STORAGE_KEY, JSON.stringify(bookings))
    window.dispatchEvent(new CustomEvent("visa-bookings-updated", { detail: bookings }))
  } catch (error) {
    console.error("Failed to save visa bookings:", error)
  }
}

export function addVisaBookingToStorage(booking: VisaBookingData) {
  const bookings = getVisaBookingsFromStorage()
  bookings.unshift(booking)
  saveVisaBookingsToStorage(bookings)
  return booking
}

export function getVisaBookingByIdFromStorage(id: string): VisaBookingData | undefined {
  const bookings = getVisaBookingsFromStorage()
  return bookings.find((b) => b.id.toUpperCase() === id.toUpperCase())
}

export function updateVisaBookingStatusInStorage(id: string, status: VisaBookingData["status"]) {
  const bookings = getVisaBookingsFromStorage()
  const index = bookings.findIndex((b) => b.id === id)
  if (index !== -1) {
    bookings[index].status = status
    saveVisaBookingsToStorage(bookings)
    return bookings[index]
  }
  return null
}

export function generateVisaBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `VS${timestamp}${random}`
}
