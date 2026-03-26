import "server-only"

import { createHmac, timingSafeEqual } from "crypto"

import { cookies } from "next/headers"

const ADMIN_SESSION_COOKIE = "yourborders_admin_session"
const SESSION_PAYLOAD = "admin"

function getAdminPassword() {
  return process.env.ADMIN_DASHBOARD_PASSWORD?.trim() || null
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword()
}

function createSignature(payload: string) {
  const secret = getSessionSecret()

  if (!secret) {
    return null
  }

  return createHmac("sha256", secret).update(payload).digest("hex")
}

function createSessionValue() {
  const signature = createSignature(SESSION_PAYLOAD)
  return signature ? `${SESSION_PAYLOAD}.${signature}` : null
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function verifySessionValue(value: string | undefined) {
  if (!value) {
    return false
  }

  const expected = createSessionValue()

  if (!expected) {
    return false
  }

  return safeEqual(value, expected)
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword())
}

export async function loginAdminSession(password: string) {
  const adminPassword = getAdminPassword()

  if (!adminPassword) {
    return {
      success: false,
      message: "Set ADMIN_DASHBOARD_PASSWORD before using the admin dashboard.",
    }
  }

  if (!safeEqual(password, adminPassword)) {
    return {
      success: false,
      message: "Invalid admin password.",
    }
  }

  const sessionValue = createSessionValue()

  if (!sessionValue) {
    return {
      success: false,
      message: "Admin session secret is not configured.",
    }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return {
    success: true,
    message: "Admin session started.",
  }
}

export async function logoutAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function hasAdminSession() {
  const cookieStore = await cookies()
  return verifySessionValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}
