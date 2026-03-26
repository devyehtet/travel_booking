"use server"

import { z } from "zod"

import {
  generateBookingId,
  generateVisaBookingId,
  TOUR_BOOKING_STATUSES,
  VISA_BOOKING_STATUSES,
  type BookingData,
  type StoredBooking,
  type VisaBookingData,
} from "@/lib/booking-store"
import {
  createTourBookingRecord,
  createVisaBookingRecord,
  findStoredBookingById,
  listTourBookings,
  listVisaBookings,
  updateTourBookingRecord,
  updateVisaBookingRecord,
} from "@/lib/server/booking-repository"
import { hasAdminSession, loginAdminSession, logoutAdminSession } from "@/lib/server/admin-auth"
import {
  sendBookingStatusUpdate,
  sendTourBookingConfirmation,
  sendVisaBookingConfirmation,
} from "@/app/actions/send-email"

const tourBookingInputSchema = z.object({
  tourId: z.number().int().positive(),
  tourTitle: z.string().min(1),
  tourLocation: z.string().min(1),
  tourDuration: z.string().min(1),
  tourPrice: z.number().nonnegative(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  nationality: z.string().min(1),
  numberOfGuests: z.number().int().positive(),
  travelDate: z.string().min(1),
  specialRequests: z.string().optional(),
  preferredLanguage: z.string().min(1),
})

const visaBookingInputSchema = z.object({
  serviceType: z.string().min(1),
  serviceTitle: z.string().min(1),
  servicePrice: z.number().nonnegative(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  nationality: z.string().min(1),
  passportNumber: z.string().min(3),
  currentVisaType: z.string().min(1),
  visaType: z.string().min(1),
  visaExpiryDate: z.string().min(1),
  currentAddress: z.string().min(1),
  preferredDate: z.string().min(1),
  additionalNotes: z.string().optional(),
  preferredLanguage: z.string().min(1),
})

const lookupSchema = z.object({
  bookingId: z.string().trim().min(2),
})

const adminLoginSchema = z.object({
  password: z.string().min(1),
})

const updateStatusSchema = z.discriminatedUnion("bookingType", [
  z.object({
    bookingType: z.literal("tour"),
    bookingId: z.string().min(1),
    newStatus: z.enum(TOUR_BOOKING_STATUSES),
    sendEmail: z.boolean().default(false),
    message: z.string().optional(),
  }),
  z.object({
    bookingType: z.literal("visa"),
    bookingId: z.string().min(1),
    newStatus: z.enum(VISA_BOOKING_STATUSES),
    sendEmail: z.boolean().default(false),
    message: z.string().optional(),
  }),
])

function normalizeOptionalString(value: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

type ActionResult<T> =
  | ({ success: true; message: string } & T)
  | { success: false; message: string }

export async function createTourBooking(
  input: z.input<typeof tourBookingInputSchema>,
): Promise<ActionResult<{ booking: BookingData; emailSent: boolean }>> {
  const parsed = tourBookingInputSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all required tour booking fields.",
    }
  }

  const booking: BookingData = {
    bookingType: "tour",
    id: generateBookingId(),
    ...parsed.data,
    specialRequests: normalizeOptionalString(parsed.data.specialRequests),
    totalPrice: parsed.data.tourPrice * parsed.data.numberOfGuests,
    currency: "THB",
    createdAt: new Date().toISOString(),
    status: "pending",
  }

  await createTourBookingRecord(booking)

  const emailResult = await sendTourBookingConfirmation({
    bookingId: booking.id,
    customerName: booking.fullName,
    email: booking.email,
    tourTitle: booking.tourTitle,
    travelDate: booking.travelDate,
    numberOfGuests: booking.numberOfGuests,
    totalPrice: booking.totalPrice,
    currency: "฿",
    phone: booking.phone,
    nationality: booking.nationality,
    specialRequests: booking.specialRequests,
  })

  return {
    success: true,
    message: emailResult.success
      ? "Booking submitted successfully."
      : "Booking submitted, but the confirmation email could not be sent.",
    booking,
    emailSent: emailResult.success,
  }
}

export async function createVisaBooking(
  input: z.input<typeof visaBookingInputSchema>,
): Promise<ActionResult<{ booking: VisaBookingData; emailSent: boolean }>> {
  const parsed = visaBookingInputSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all required visa request fields.",
    }
  }

  const booking: VisaBookingData = {
    bookingType: "visa",
    id: generateVisaBookingId(),
    ...parsed.data,
    additionalNotes: normalizeOptionalString(parsed.data.additionalNotes),
    currency: "THB",
    createdAt: new Date().toISOString(),
    status: "pending",
  }

  await createVisaBookingRecord(booking)

  const emailResult = await sendVisaBookingConfirmation({
    bookingId: booking.id,
    customerName: booking.fullName,
    email: booking.email,
    serviceTitle: booking.serviceTitle,
    preferredDate: booking.preferredDate,
    passportNumber: booking.passportNumber,
    currentVisaType: `${booking.currentVisaType} - ${booking.visaType}`,
    servicePrice: booking.servicePrice,
    currency: "฿",
    phone: booking.phone,
    visaExpiryDate: booking.visaExpiryDate,
    address: booking.currentAddress,
    additionalNotes: booking.additionalNotes,
  })

  return {
    success: true,
    message: emailResult.success
      ? "Visa request submitted successfully."
      : "Visa request submitted, but the confirmation email could not be sent.",
    booking,
    emailSent: emailResult.success,
  }
}

export async function lookupStoredBooking(
  input: z.input<typeof lookupSchema>,
): Promise<ActionResult<{ booking: StoredBooking }>> {
  const parsed = lookupSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a valid booking or request ID.",
    }
  }

  const booking = await findStoredBookingById(parsed.data.bookingId)

  if (!booking) {
    return {
      success: false,
      message: "Booking not found.",
    }
  }

  return {
    success: true,
    message: "Booking found.",
    booking,
  }
}

export async function getAdminSessionState() {
  return {
    authenticated: await hasAdminSession(),
  }
}

export async function loginAdmin(
  input: z.input<typeof adminLoginSchema>,
): Promise<{ success: boolean; message: string }> {
  const parsed = adminLoginSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Enter the admin password.",
    }
  }

  return loginAdminSession(parsed.data.password)
}

export async function logoutAdmin() {
  await logoutAdminSession()
}

export async function getAdminDashboardData(): Promise<
  | { authenticated: false; message: string }
  | { authenticated: true; tours: BookingData[]; visas: VisaBookingData[] }
> {
  if (!(await hasAdminSession())) {
    return {
      authenticated: false,
      message: "Admin authentication required.",
    }
  }

  const [tours, visas] = await Promise.all([listTourBookings(), listVisaBookings()])

  return {
    authenticated: true,
    tours,
    visas,
  }
}

export async function updateStoredBookingStatus(
  input: z.input<typeof updateStatusSchema>,
): Promise<
  ActionResult<{
    booking: StoredBooking
    emailSent: boolean
  }>
> {
  if (!(await hasAdminSession())) {
    return {
      success: false,
      message: "Admin authentication required.",
    }
  }

  const parsed = updateStatusSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid booking status update.",
    }
  }

  const { bookingId, sendEmail, message } = parsed.data

  if (parsed.data.bookingType === "tour") {
    const newStatus = parsed.data.newStatus
    const existing = await findStoredBookingById(bookingId)

    if (!existing || existing.bookingType !== "tour") {
      return {
        success: false,
        message: "Tour booking not found.",
      }
    }

    const updated = await updateTourBookingRecord(bookingId, (booking) => ({
      ...booking,
      status: newStatus,
    }))

    if (!updated) {
      return {
        success: false,
        message: "Tour booking not found.",
      }
    }

    let emailSent = false

    if (sendEmail) {
      const emailResult = await sendBookingStatusUpdate({
        bookingId: updated.id,
        customerName: updated.fullName,
        email: updated.email,
        bookingType: "tour",
        itemTitle: updated.tourTitle,
        oldStatus: existing.status,
        newStatus: updated.status,
        message: normalizeOptionalString(message),
        travelDate: updated.travelDate,
      })

      emailSent = emailResult.success
    }

    return {
      success: true,
      message: sendEmail && !emailSent ? "Status updated, but the email could not be sent." : "Status updated successfully.",
      booking: updated,
      emailSent,
    }
  }

  const newStatus = parsed.data.newStatus
  const existing = await findStoredBookingById(bookingId)

  if (!existing || existing.bookingType !== "visa") {
    return {
      success: false,
      message: "Visa request not found.",
    }
  }

  const updated = await updateVisaBookingRecord(bookingId, (booking) => ({
    ...booking,
    status: newStatus,
  }))

  if (!updated) {
    return {
      success: false,
      message: "Visa request not found.",
    }
  }

  let emailSent = false

  if (sendEmail) {
    const emailResult = await sendBookingStatusUpdate({
      bookingId: updated.id,
      customerName: updated.fullName,
      email: updated.email,
      bookingType: "visa",
      itemTitle: updated.serviceTitle,
      oldStatus: existing.status,
      newStatus: updated.status,
      message: normalizeOptionalString(message),
      serviceDate: updated.preferredDate,
    })

    emailSent = emailResult.success
  }

  return {
    success: true,
    message: sendEmail && !emailSent ? "Status updated, but the email could not be sent." : "Status updated successfully.",
    booking: updated,
    emailSent,
  }
}
