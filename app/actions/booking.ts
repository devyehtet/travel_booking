"use server"

export interface BookingFormData {
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
}

export interface BookingResult {
  success: boolean
  bookingId: string | null
  booking?: {
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
  message: string
}

export async function submitBooking(formData: BookingFormData): Promise<BookingResult> {
  try {
    // Generate unique ID
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const booking = {
      id: bookingId,
      ...formData,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
    }

    // Return booking data to be stored on client
    return {
      success: true,
      bookingId,
      booking,
      message: "Booking submitted successfully! We will contact you shortly.",
    }
  } catch (error) {
    console.error("Booking submission error:", error)
    return {
      success: false,
      bookingId: null,
      message: "Failed to submit booking. Please try again.",
    }
  }
}
