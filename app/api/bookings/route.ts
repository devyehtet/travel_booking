import { NextResponse } from "next/server"
import { z } from "zod"

import type { BookingData } from "@/lib/booking-store"
import { hasAdminSession } from "@/lib/server/admin-auth"
import { createTourBookingRecord, findStoredBookingById, listTourBookings } from "@/lib/server/booking-repository"

const bookingRecordSchema: z.ZodType<BookingData> = z.object({
  bookingType: z.literal("tour"),
  id: z.string().min(1),
  tourId: z.number().int().positive(),
  tourTitle: z.string().min(1),
  tourLocation: z.string().min(1),
  tourDuration: z.string().min(1),
  tourPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  currency: z.literal("THB"),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  nationality: z.string().min(1),
  numberOfGuests: z.number().int().positive(),
  travelDate: z.string().min(1),
  specialRequests: z.string().optional(),
  preferredLanguage: z.string().min(1),
  createdAt: z.string().min(1),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get("id")

  if (bookingId) {
    const booking = await findStoredBookingById(bookingId)

    if (!booking || booking.bookingType !== "tour") {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking,
    })
  }

  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const bookings = await listTourBookings()
  return NextResponse.json({
    success: true,
    bookings,
  })
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const booking = bookingRecordSchema.parse(payload)

    await createTourBookingRecord(booking)

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
    })
  } catch {
    return NextResponse.json({ success: false, message: "Invalid booking data" }, { status: 400 })
  }
}
