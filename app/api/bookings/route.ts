import { NextResponse } from "next/server"
import type { BookingData } from "@/lib/booking-store"

export async function GET() {
  // Note: This API cannot access localStorage as it runs on the server
  // Bookings are stored in browser localStorage and managed client-side
  return NextResponse.json({
    success: true,
    message: "Bookings are stored in browser localStorage. Access them via the admin dashboard at /admin/bookings",
    note: "For production, connect a database like Supabase to persist bookings server-side.",
  })
}

export async function POST(request: Request) {
  try {
    const booking: BookingData = await request.json()

    // Here you could:
    // 1. Send to a webhook (Zapier, Make, etc.)
    // 2. Send email notification
    // 3. Log to external service

    console.log("[Booking Received]", booking.id, booking.fullName, booking.tourTitle)

    return NextResponse.json({
      success: true,
      message: "Booking received",
      bookingId: booking.id,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid booking data" }, { status: 400 })
  }
}
