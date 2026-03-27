import "server-only"

import { get, list, put } from "@vercel/blob"
import { promises as fs } from "fs"
import path from "path"

import type { BookingData, StoredBooking, VisaBookingData } from "@/lib/booking-store"

const dataDirectory = path.join(process.cwd(), "data")
const tourBookingsFile = path.join(dataDirectory, "bookings.json")
const visaBookingsFile = path.join(dataDirectory, "visa-bookings.json")

const blobAccess = "private" as const
const tourBlobPrefix = "bookings/tours/"
const visaBlobPrefix = "bookings/visas/"

function hasBlobBookingStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
}

export function hasDurableBookingStorage() {
  return hasBlobBookingStorage() || !process.env.VERCEL
}

function getTourBlobPath(id: string) {
  return `${tourBlobPrefix}${id}.json`
}

function getVisaBlobPath(id: string) {
  return `${visaBlobPrefix}${id}.json`
}

async function ensureArrayFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })

  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8")
  }
}

async function readLocalCollection<T>(filePath: string): Promise<T[]> {
  await ensureArrayFile(filePath)

  try {
    const raw = await fs.readFile(filePath, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLocalCollection<T>(filePath: string, records: T[]) {
  await ensureArrayFile(filePath)
  await fs.writeFile(filePath, `${JSON.stringify(records, null, 2)}\n`, "utf8")
}

async function readBlobRecord<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: blobAccess, useCache: false })

  if (!result || result.statusCode !== 200) {
    return null
  }

  try {
    const raw = await new Response(result.stream).text()
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function listBlobRecords<T>(prefix: string): Promise<T[]> {
  const records: T[] = []
  let cursor: string | undefined

  do {
    const result = await list({ prefix, cursor, limit: 1000 })

    const pageRecords = await Promise.all(result.blobs.map((blob) => readBlobRecord<T>(blob.pathname)))
    const nonNullPageRecords = pageRecords.filter((record): record is NonNullable<typeof record> => record !== null)
    records.push(...nonNullPageRecords)

    cursor = result.cursor

    if (!result.hasMore) {
      break
    }
  } while (cursor)

  return records
}

function sortStoredBookingsByCreatedAt<T extends StoredBooking>(records: T[]) {
  return [...records].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
}

async function writeBlobRecord<T>(pathname: string, record: T) {
  await put(pathname, JSON.stringify(record, null, 2), {
    access: blobAccess,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  })
}

async function listLocalTourBookings() {
  return readLocalCollection<BookingData>(tourBookingsFile)
}

async function listLocalVisaBookings() {
  return readLocalCollection<VisaBookingData>(visaBookingsFile)
}

export async function listTourBookings() {
  if (hasBlobBookingStorage()) {
    return sortStoredBookingsByCreatedAt(await listBlobRecords<BookingData>(tourBlobPrefix))
  }

  if (process.env.VERCEL) {
    return []
  }

  return listLocalTourBookings()
}

export async function listVisaBookings() {
  if (hasBlobBookingStorage()) {
    return sortStoredBookingsByCreatedAt(await listBlobRecords<VisaBookingData>(visaBlobPrefix))
  }

  if (process.env.VERCEL) {
    return []
  }

  return listLocalVisaBookings()
}

export async function createTourBookingRecord(booking: BookingData) {
  if (hasBlobBookingStorage()) {
    await writeBlobRecord(getTourBlobPath(booking.id), booking)
    return booking
  }

  const records = await listLocalTourBookings()
  records.unshift(booking)
  await writeLocalCollection(tourBookingsFile, records)
  return booking
}

export async function createVisaBookingRecord(booking: VisaBookingData) {
  if (hasBlobBookingStorage()) {
    await writeBlobRecord(getVisaBlobPath(booking.id), booking)
    return booking
  }

  const records = await listLocalVisaBookings()
  records.unshift(booking)
  await writeLocalCollection(visaBookingsFile, records)
  return booking
}

export async function findTourBookingById(id: string) {
  if (hasBlobBookingStorage()) {
    return readBlobRecord<BookingData>(getTourBlobPath(id))
  }

  const records = await listLocalTourBookings()
  return records.find((booking) => booking.id.toUpperCase() === id.toUpperCase()) ?? null
}

export async function findVisaBookingById(id: string) {
  if (hasBlobBookingStorage()) {
    return readBlobRecord<VisaBookingData>(getVisaBlobPath(id))
  }

  const records = await listLocalVisaBookings()
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
  if (hasBlobBookingStorage()) {
    const existing = await findTourBookingById(id)

    if (!existing) {
      return null
    }

    const updated = updater(existing)
    await writeBlobRecord(getTourBlobPath(id), updated)
    return updated
  }

  const records = await listLocalTourBookings()
  const index = records.findIndex((booking) => booking.id === id)

  if (index === -1) {
    return null
  }

  records[index] = updater(records[index])
  await writeLocalCollection(tourBookingsFile, records)
  return records[index]
}

export async function updateVisaBookingRecord(id: string, updater: (booking: VisaBookingData) => VisaBookingData) {
  if (hasBlobBookingStorage()) {
    const existing = await findVisaBookingById(id)

    if (!existing) {
      return null
    }

    const updated = updater(existing)
    await writeBlobRecord(getVisaBlobPath(id), updated)
    return updated
  }

  const records = await listLocalVisaBookings()
  const index = records.findIndex((booking) => booking.id === id)

  if (index === -1) {
    return null
  }

  records[index] = updater(records[index])
  await writeLocalCollection(visaBookingsFile, records)
  return records[index]
}
