import "server-only"

import { promises as fs } from "fs"
import path from "path"

import type { BookingData, StoredBooking, VisaBookingData } from "@/lib/booking-store"

const dataDirectory = path.join(process.cwd(), "data")
const tourBookingsFile = path.join(dataDirectory, "bookings.json")
const visaBookingsFile = path.join(dataDirectory, "visa-bookings.json")

async function ensureArrayFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })

  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8")
  }
}

async function readCollection<T>(filePath: string): Promise<T[]> {
  await ensureArrayFile(filePath)

  try {
    const raw = await fs.readFile(filePath, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeCollection<T>(filePath: string, records: T[]) {
  await ensureArrayFile(filePath)
  await fs.writeFile(filePath, `${JSON.stringify(records, null, 2)}\n`, "utf8")
}

export async function listTourBookings() {
  return readCollection<BookingData>(tourBookingsFile)
}

export async function listVisaBookings() {
  return readCollection<VisaBookingData>(visaBookingsFile)
}

export async function createTourBookingRecord(booking: BookingData) {
  const records = await listTourBookings()
  records.unshift(booking)
  await writeCollection(tourBookingsFile, records)
  return booking
}

export async function createVisaBookingRecord(booking: VisaBookingData) {
  const records = await listVisaBookings()
  records.unshift(booking)
  await writeCollection(visaBookingsFile, records)
  return booking
}

export async function findTourBookingById(id: string) {
  const records = await listTourBookings()
  return records.find((booking) => booking.id.toUpperCase() === id.toUpperCase()) ?? null
}

export async function findVisaBookingById(id: string) {
  const records = await listVisaBookings()
  return records.find((booking) => booking.id.toUpperCase() === id.toUpperCase()) ?? null
}

export async function findStoredBookingById(id: string): Promise<StoredBooking | null> {
  const tourBooking = await findTourBookingById(id)
  if (tourBooking) {
    return tourBooking
  }

  return findVisaBookingById(id)
}

export async function updateTourBookingRecord(id: string, updater: (booking: BookingData) => BookingData) {
  const records = await listTourBookings()
  const index = records.findIndex((booking) => booking.id === id)

  if (index === -1) {
    return null
  }

  records[index] = updater(records[index])
  await writeCollection(tourBookingsFile, records)
  return records[index]
}

export async function updateVisaBookingRecord(id: string, updater: (booking: VisaBookingData) => VisaBookingData) {
  const records = await listVisaBookings()
  const index = records.findIndex((booking) => booking.id === id)

  if (index === -1) {
    return null
  }

  records[index] = updater(records[index])
  await writeCollection(visaBookingsFile, records)
  return records[index]
}
