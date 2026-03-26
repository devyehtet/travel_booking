"use server"

import {
  generateTourBookingEmailHTML,
  generateTourBookingEmailText,
  generateVisaBookingEmailHTML,
  generateVisaBookingEmailText,
  generateAdminNotificationEmailHTML,
  generateStatusUpdateEmailHTML,
  generateStatusUpdateEmailText,
  type TourBookingEmailData,
  type VisaBookingEmailData,
  type StatusUpdateEmailData,
} from "@/lib/email-templates"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "Your Borders <noreply@mail.yehtet.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mail.yehtet.com"

interface EmailResult {
  success: boolean
  message: string
  emailId?: string
  customerEmailSent?: boolean
  adminNotificationSent?: boolean
}

async function sendEmailViaResend(to: string, subject: string, html: string, text: string): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    console.log("=== EMAIL WOULD BE SENT ===")
    console.log("To:", to)
    console.log("Subject:", subject)
    console.log("Text Preview:", text.substring(0, 200) + "...")
    console.log("===========================")

    return {
      success: true,
      message: "Email logged (no RESEND_API_KEY configured)",
    }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to send email")
    }

    const data = await response.json()
    return {
      success: true,
      message: "Email sent successfully",
      emailId: data.id,
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

function combineCustomerAndAdminEmailResults(
  customerResult: EmailResult,
  adminResult: EmailResult,
  entityLabel: "booking" | "visa request",
): EmailResult {
  if (customerResult.success && adminResult.success) {
    return {
      success: true,
      message: "Customer confirmation and admin notification sent successfully.",
      emailId: customerResult.emailId,
      customerEmailSent: true,
      adminNotificationSent: true,
    }
  }

  if (customerResult.success) {
    return {
      success: true,
      message: `The ${entityLabel} was confirmed to the customer, but the admin notification email failed.`,
      emailId: customerResult.emailId,
      customerEmailSent: true,
      adminNotificationSent: false,
    }
  }

  if (adminResult.success) {
    return {
      success: true,
      message: `The ${entityLabel} reached the admin inbox, but the customer confirmation email failed.`,
      emailId: adminResult.emailId,
      customerEmailSent: false,
      adminNotificationSent: true,
    }
  }

  return {
    success: false,
    message: customerResult.message || adminResult.message || "Failed to send email notifications",
    customerEmailSent: false,
    adminNotificationSent: false,
  }
}

export async function sendTourBookingConfirmation(data: TourBookingEmailData): Promise<EmailResult> {
  const subject = `Booking Confirmed! Your Borders - ${data.bookingId}`
  const html = generateTourBookingEmailHTML(data)
  const text = generateTourBookingEmailText(data)

  // Send to customer
  const customerResult = await sendEmailViaResend(data.email, subject, html, text)

  // Always send detailed admin notification
  const adminSubject = `🎫 NEW TOUR BOOKING: ${data.bookingId} | ${data.customerName} | ${data.tourTitle}`
  const adminHtml = generateAdminNotificationEmailHTML("tour", data)
  const adminText = `New tour booking from ${data.customerName} (${data.email}) for ${data.tourTitle}. Booking ID: ${data.bookingId}. Total: ${data.currency}${data.totalPrice}. Travel Date: ${data.travelDate}. Travelers: ${data.numberOfGuests}. Phone: ${data.phone}.`
  const adminResult = await sendEmailViaResend(ADMIN_EMAIL, adminSubject, adminHtml, adminText)

  return combineCustomerAndAdminEmailResults(customerResult, adminResult, "booking")
}

export async function sendVisaBookingConfirmation(data: VisaBookingEmailData): Promise<EmailResult> {
  const subject = `Visa Request Received! Your Borders - ${data.bookingId}`
  const html = generateVisaBookingEmailHTML(data)
  const text = generateVisaBookingEmailText(data)

  // Send to customer
  const customerResult = await sendEmailViaResend(data.email, subject, html, text)

  // Always send detailed admin notification
  const adminSubject = `📄 NEW VISA REQUEST: ${data.bookingId} | ${data.customerName} | ${data.serviceTitle}`
  const adminHtml = generateAdminNotificationEmailHTML("visa", data)
  const adminText = `New visa request from ${data.customerName} (${data.email}) for ${data.serviceTitle}. Request ID: ${data.bookingId}. Fee: ${data.currency}${data.servicePrice}. Preferred Date: ${data.preferredDate}. Passport: ${data.passportNumber}. Phone: ${data.phone}. Visa Expiry: ${data.visaExpiryDate}.`
  const adminResult = await sendEmailViaResend(ADMIN_EMAIL, adminSubject, adminHtml, adminText)

  return combineCustomerAndAdminEmailResults(customerResult, adminResult, "visa request")
}

export async function sendBookingStatusUpdate(data: StatusUpdateEmailData): Promise<EmailResult> {
  const isTour = data.bookingType === "tour"
  const statusLabels: Record<string, string> = {
    confirmed: "Confirmed ✅",
    processing: "Processing 🔄",
    completed: "Completed 🎉",
    cancelled: "Cancelled ❌",
    pending: "Pending ⏳",
  }

  const subject = `${isTour ? "Booking" : "Visa Request"} ${statusLabels[data.newStatus]} - ${data.bookingId} | Your Borders`
  const html = generateStatusUpdateEmailHTML(data)
  const text = generateStatusUpdateEmailText(data)

  return await sendEmailViaResend(data.email, subject, html, text)
}
