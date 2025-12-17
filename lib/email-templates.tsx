// Email templates for tour and visa bookings

export interface TourBookingEmailData {
  bookingId: string
  customerName: string
  email: string
  tourTitle: string
  travelDate: string
  numberOfGuests: number
  totalPrice: number
  currency: string
  phone: string
  nationality: string
  specialRequests?: string
}

export interface VisaBookingEmailData {
  bookingId: string
  customerName: string
  email: string
  serviceTitle: string
  preferredDate: string
  passportNumber: string
  currentVisaType: string
  servicePrice: number
  currency: string
  phone: string
  visaExpiryDate: string
  address: string
  additionalNotes?: string
}

export interface StatusUpdateEmailData {
  bookingId: string
  customerName: string
  email: string
  bookingType: "tour" | "visa"
  itemTitle: string
  oldStatus: string
  newStatus: string
  message?: string
  travelDate?: string
  serviceDate?: string
}

export function generateTourBookingEmailHTML(data: TourBookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Your Borders</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d6b4e 0%, #0a5a41 100%); padding: 40px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Your Borders</h1>
              <p style="margin: 8px 0 0 0; color: #a7d9c9; font-size: 14px;">Cross Borders, Not Boundaries</p>
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #d4edda; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✓</span>
              </div>
              <h2 style="margin: 20px 0 10px 0; color: #1a1a1a; font-size: 24px;">Booking Confirmed!</h2>
              <p style="margin: 0; color: #666666; font-size: 16px;">Thank you for choosing Your Borders</p>
            </td>
          </tr>
          
          <!-- Booking ID -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <div style="background-color: #f0fdf4; border: 2px dashed #0d6b4e; border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">Your Booking ID</p>
                <p style="margin: 0; color: #0d6b4e; font-size: 28px; font-weight: 700; font-family: monospace;">${data.bookingId}</p>
              </div>
            </td>
          </tr>
          
          <!-- Booking Details -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">Booking Details</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Tour Package</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.tourTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Travel Date</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.travelDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Guests</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.numberOfGuests} person(s)</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 16px; border-top: 1px solid #e2e8f0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="color: #1a1a1a; font-size: 18px; font-weight: 700;">Total Amount</td>
                          <td style="color: #0d6b4e; font-size: 24px; font-weight: 700; text-align: right;">${data.currency}${data.totalPrice.toLocaleString()}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Customer Info -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fef9e7; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">Customer Information</h3>
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;"><strong>Name:</strong> ${data.customerName}</p>
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #0d6b4e;">${data.phone}</a></p>
                <p style="margin: 0; color: #666666; font-size: 14px;"><strong>Nationality:</strong> ${data.nationality}</p>
              </div>
            </td>
          </tr>
          
          <!-- Special Requests -->
          ${
            data.specialRequests
              ? `
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fefce8; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">Special Requests</h3>
                <p style="margin: 0; color: #666666; font-size: 14px;">${data.specialRequests}</p>
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- What's Next -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">What's Next?</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="display: inline-block; width: 32px; height: 32px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px;">1</div>
                    <span style="color: #666666; font-size: 14px;">Our team will review your booking within 24 hours</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="display: inline-block; width: 32px; height: 32px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px;">2</div>
                    <span style="color: #666666; font-size: 14px;">We'll contact you to confirm details and payment</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="display: inline-block; width: 32px; height: 32px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px;">3</div>
                    <span style="color: #666666; font-size: 14px;">Receive your complete travel itinerary via email</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="https://yourborders.com/booking/lookup" style="display: inline-block; background-color: #0d6b4e; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Track Your Booking</a>
            </td>
          </tr>
          
          <!-- Contact -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #666666; font-size: 14px;">Need help? Contact us anytime</p>
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px;">📱 WhatsApp: +66 XX XXX XXXX</p>
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px;">📧 Email: support@yourborders.com</p>
              <p style="margin: 0; color: #1a1a1a; font-size: 14px;">🕐 Available 24/7 for Myanmar speakers</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #a0a0a0; font-size: 12px;">© 2025 Your Borders. All rights reserved.</p>
              <p style="margin: 0; color: #a0a0a0; font-size: 12px;">Your trusted partner for Thailand travel & visa services</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generateVisaBookingEmailHTML(data: VisaBookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visa Service Request - Your Borders</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d6b4e 0%, #0a5a41 100%); padding: 40px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Your Borders</h1>
              <p style="margin: 8px 0 0 0; color: #a7d9c9; font-size: 14px;">Cross Borders, Not Boundaries</p>
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #e0f2fe; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">📋</span>
              </div>
              <h2 style="margin: 20px 0 10px 0; color: #1a1a1a; font-size: 24px;">Visa Service Request Received!</h2>
              <p style="margin: 0; color: #666666; font-size: 16px;">We'll process your request promptly</p>
            </td>
          </tr>
          
          <!-- Request ID -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <div style="background-color: #f0fdf4; border: 2px dashed #0d6b4e; border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">Your Request ID</p>
                <p style="margin: 0; color: #0d6b4e; font-size: 28px; font-weight: 700; font-family: monospace;">${data.bookingId}</p>
              </div>
            </td>
          </tr>
          
          <!-- Service Details -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">Service Details</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Service Type</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.serviceTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Preferred Date</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.preferredDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Current Visa</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.currentVisaType}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 16px; border-top: 1px solid #e2e8f0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="color: #1a1a1a; font-size: 18px; font-weight: 700;">Service Fee</td>
                          <td style="color: #0d6b4e; font-size: 24px; font-weight: 700; text-align: right;">${data.currency}${data.servicePrice.toLocaleString()}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Applicant Info -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fef9e7; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">Applicant Information</h3>
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;"><strong>Name:</strong> ${data.customerName}</p>
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #0d6b4e;">${data.phone}</a></p>
                <p style="margin: 0; color: #666666; font-size: 14px;"><strong>Passport:</strong> ${data.passportNumber.substring(0, 3)}****${data.passportNumber.slice(-2)}</p>
              </div>
            </td>
          </tr>
          
          <!-- Important Notice -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fef3cd; border-left: 4px solid #ffc107; border-radius: 0 12px 12px 0; padding: 20px;">
                <h4 style="margin: 0 0 12px 0; color: #856404; font-size: 16px;">⚠️ Important Documents Required</h4>
                <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
                  <li style="margin-bottom: 6px;">Original passport with at least 6 months validity</li>
                  <li style="margin-bottom: 6px;">Passport-sized photos (4x6 cm, white background)</li>
                  <li style="margin-bottom: 6px;">Current visa stamp/TM6 departure card</li>
                  <li>Proof of address (if applicable)</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Process Steps -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">What Happens Next?</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="display: inline-block; width: 32px; height: 32px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px;">1</div>
                    <span style="color: #666666; font-size: 14px;">We'll review your request within 2-4 hours</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="display: inline-block; width: 32px; height: 32px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px;">2</div>
                    <span style="color: #666666; font-size: 14px;">Contact you via WhatsApp/Phone to confirm details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="display: inline-block; width: 32px; height: 32px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px;">3</div>
                    <span style="color: #666666; font-size: 14px;">Schedule appointment & collect documents</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="display: inline-block; width: 32px; height: 32px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px;">4</div>
                    <span style="color: #666666; font-size: 14px;">Complete your visa service hassle-free!</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="https://yourborders.com/booking/lookup" style="display: inline-block; background-color: #0d6b4e; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Track Your Request</a>
            </td>
          </tr>
          
          <!-- Contact -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #666666; font-size: 14px;">Questions about your visa? Contact us</p>
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px;">📱 WhatsApp: +66 XX XXX XXXX</p>
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px;">📧 Email: visa@yourborders.com</p>
              <p style="margin: 0; color: #1a1a1a; font-size: 14px;">🗣️ မြန်မာစကား ပြောဆိုနိုင်ပါသည်</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #a0a0a0; font-size: 12px;">© 2025 Your Borders. All rights reserved.</p>
              <p style="margin: 0; color: #a0a0a0; font-size: 12px;">Professional visa services for Myanmar nationals in Thailand</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Plain text versions for email clients that don't support HTML
export function generateTourBookingEmailText(data: TourBookingEmailData): string {
  return `
YOUR BORDERS - BOOKING CONFIRMATION
====================================

Booking ID: ${data.bookingId}

Dear ${data.customerName},

Thank you for booking with Your Borders! Your tour booking has been confirmed.

BOOKING DETAILS
---------------
Tour: ${data.tourTitle}
Travel Date: ${data.travelDate}
Guests: ${data.numberOfGuests} person(s)
Total Amount: ${data.currency}${data.totalPrice.toLocaleString()}

CUSTOMER INFORMATION
--------------------
Name: ${data.customerName}
Email: ${data.email}
Phone: ${data.phone}
Nationality: ${data.nationality}

SPECIAL REQUESTS
----------------
${data.specialRequests || "No special requests"}

WHAT'S NEXT?
------------
1. Our team will review your booking within 24 hours
2. We'll contact you to confirm details and payment
3. You'll receive your complete travel itinerary via email

NEED HELP?
----------
WhatsApp: +66 XX XXX XXXX
Email: support@yourborders.com
Available 24/7 for Myanmar speakers

Track your booking: https://yourborders.com/booking/lookup

Thank you for choosing Your Borders!
Cross Borders, Not Boundaries

© 2025 Your Borders. All rights reserved.
  `
}

export function generateVisaBookingEmailText(data: VisaBookingEmailData): string {
  return `
YOUR BORDERS - VISA SERVICE REQUEST
====================================

Request ID: ${data.bookingId}

Dear ${data.customerName},

Thank you for submitting your visa service request! We've received your application.

SERVICE DETAILS
---------------
Service: ${data.serviceTitle}
Preferred Date: ${data.preferredDate}
Current Visa: ${data.currentVisaType}
Service Fee: ${data.currency}${data.servicePrice.toLocaleString()}

APPLICANT INFORMATION
--------------------
Name: ${data.customerName}
Email: ${data.email}
Phone: ${data.phone}
Passport: ${data.passportNumber.substring(0, 3)}****${data.passportNumber.slice(-2)}

IMPORTANT DOCUMENTS REQUIRED
--------------------------
- Original passport with at least 6 months validity
- Passport-sized photos (4x6 cm, white background)
- Current visa stamp/TM6 departure card
- Proof of address (if applicable)

ADDITIONAL NOTES
----------------
${data.additionalNotes || "No additional notes"}

WHAT HAPPENS NEXT?
------------------
1. We'll review your request within 2-4 hours
2. Contact you via WhatsApp/Phone to confirm details
3. Schedule appointment & collect documents
4. Complete your visa service hassle-free!

CONTACT US
----------
WhatsApp: +66 XX XXX XXXX
Email: visa@yourborders.com
မြန်မာစကား ပြောဆိုနိုင်ပါသည်

Track your request: https://yourborders.com/booking/lookup

Thank you for choosing Your Borders!
Cross Borders, Not Boundaries

© 2025 Your Borders. All rights reserved.
  `
}

// Admin notification email
export function generateAdminNotificationEmailHTML(
  type: "tour" | "visa",
  data: TourBookingEmailData | VisaBookingEmailData,
): string {
  const isTour = type === "tour"
  const tourData = data as TourBookingEmailData
  const visaData = data as VisaBookingEmailData

  if (isTour) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Tour Booking - Your Borders Admin</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; margin: 0 auto; padding: 30px;">
    <tr>
      <td>
        <div style="background-color: #0d6b4e; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px;">
          <h1 style="margin: 0; font-size: 24px;">🎫 New Tour Booking</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking ID: ${tourData.bookingId}</p>
        </div>
        
        <h3 style="color: #0d6b4e; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📋 Customer Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 150px;">Full Name:</td>
            <td style="padding: 8px 0; font-weight: 600;">${tourData.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${tourData.email}" style="color: #0d6b4e;">${tourData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${tourData.phone}" style="color: #0d6b4e;">${tourData.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Nationality:</td>
            <td style="padding: 8px 0;">${tourData.nationality}</td>
          </tr>
        </table>

        <h3 style="color: #0d6b4e; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">✈️ Tour Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 150px;">Tour Package:</td>
            <td style="padding: 8px 0; font-weight: 600;">${tourData.tourTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Travel Date:</td>
            <td style="padding: 8px 0;">${tourData.travelDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Number of Travelers:</td>
            <td style="padding: 8px 0;">${tourData.numberOfGuests} person(s)</td>
          </tr>
        </table>

        <h3 style="color: #0d6b4e; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">💰 Payment Summary</h3>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Price per Person:</td>
              <td style="padding: 8px 0; text-align: right;">${tourData.currency}${(tourData.totalPrice / tourData.numberOfGuests).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Travelers:</td>
              <td style="padding: 8px 0; text-align: right;">× ${tourData.numberOfGuests}</td>
            </tr>
            <tr style="border-top: 2px solid #0d6b4e;">
              <td style="padding: 12px 0 0 0; font-weight: 700; font-size: 18px;">Total Amount:</td>
              <td style="padding: 12px 0 0 0; text-align: right; font-weight: 700; font-size: 18px; color: #0d6b4e;">${tourData.currency}${tourData.totalPrice.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        ${
          tourData.specialRequests
            ? `
        <h3 style="color: #0d6b4e; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📝 Special Requests</h3>
        <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; border: 1px solid #fef08a;">
          <p style="margin: 0; white-space: pre-wrap;">${tourData.specialRequests}</p>
        </div>
        `
            : ""
        }

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <h3 style="color: #0d6b4e; margin: 0 0 15px 0;">Quick Actions</h3>
          <a href="mailto:${tourData.email}?subject=Re: Your Borders Booking ${tourData.bookingId}&body=Dear ${tourData.customerName},%0D%0A%0D%0AThank you for booking with Your Borders!%0D%0A%0D%0A" style="display: inline-block; background-color: #0d6b4e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-right: 10px;">Reply to Customer</a>
          <a href="https://wa.me/${tourData.phone.replace(/[^0-9]/g, "")}?text=Hello ${encodeURIComponent(tourData.customerName)}, thank you for booking with Your Borders! Your booking ID is ${tourData.bookingId}." style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px;">WhatsApp</a>
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">
          Received on ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}<br>
          Your Borders - noneedgym.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  } else {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Visa Request - Your Borders Admin</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; margin: 0 auto; padding: 30px;">
    <tr>
      <td>
        <div style="background-color: #1e40af; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px;">
          <h1 style="margin: 0; font-size: 24px;">📄 New Visa Service Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Request ID: ${visaData.bookingId}</p>
        </div>
        
        <h3 style="color: #1e40af; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📋 Customer Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 150px;">Full Name:</td>
            <td style="padding: 8px 0; font-weight: 600;">${visaData.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${visaData.email}" style="color: #1e40af;">${visaData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${visaData.phone}" style="color: #1e40af;">${visaData.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Passport Number:</td>
            <td style="padding: 8px 0; font-weight: 600; font-family: monospace; background-color: #f1f5f9; padding: 8px; border-radius: 4px;">${visaData.passportNumber}</td>
          </tr>
        </table>

        <h3 style="color: #1e40af; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📑 Visa Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 150px;">Service Requested:</td>
            <td style="padding: 8px 0; font-weight: 600;">${visaData.serviceTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Current Visa Type:</td>
            <td style="padding: 8px 0;">${visaData.currentVisaType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Visa Expiry Date:</td>
            <td style="padding: 8px 0; ${new Date(visaData.visaExpiryDate) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) ? "color: #dc2626; font-weight: 600;" : ""}">${visaData.visaExpiryDate} ${new Date(visaData.visaExpiryDate) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) ? "⚠️ EXPIRING SOON" : ""}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Preferred Service Date:</td>
            <td style="padding: 8px 0;">${visaData.preferredDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Address in Thailand:</td>
            <td style="padding: 8px 0;">${visaData.address}</td>
          </tr>
        </table>

        <h3 style="color: #1e40af; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">💰 Service Fee</h3>
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border: 1px solid #bfdbfe;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 700; font-size: 18px;">Service Fee:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; font-size: 18px; color: #1e40af;">${visaData.currency}${visaData.servicePrice.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        ${
          visaData.additionalNotes
            ? `
        <h3 style="color: #1e40af; margin: 20px 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📝 Additional Notes</h3>
        <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; border: 1px solid #fef08a;">
          <p style="margin: 0; white-space: pre-wrap;">${visaData.additionalNotes}</p>
        </div>
        `
            : ""
        }

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <h3 style="color: #1e40af; margin: 0 0 15px 0;">Quick Actions</h3>
          <a href="mailto:${visaData.email}?subject=Re: Your Borders Visa Request ${visaData.bookingId}&body=Dear ${visaData.customerName},%0D%0A%0D%0AThank you for your visa service request with Your Borders!%0D%0A%0D%0AWe have received your request for ${visaData.serviceTitle}.%0D%0A%0D%0A" style="display: inline-block; background-color: #1e40af; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-right: 10px;">Reply to Customer</a>
          <a href="https://wa.me/${visaData.phone.replace(/[^0-9]/g, "")}?text=Hello ${encodeURIComponent(visaData.customerName)}, thank you for your visa service request with Your Borders! Your request ID is ${visaData.bookingId}." style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px;">WhatsApp</a>
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; text-align: center;">
          Received on ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}<br>
          Your Borders - noneedgym.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

export function generateStatusUpdateEmailHTML(data: StatusUpdateEmailData): string {
  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    confirmed: { bg: "#d4edda", text: "#155724", icon: "✓" },
    processing: { bg: "#cce5ff", text: "#004085", icon: "⚙️" },
    completed: { bg: "#d4edda", text: "#155724", icon: "🎉" },
    cancelled: { bg: "#f8d7da", text: "#721c24", icon: "✕" },
    pending: { bg: "#fff3cd", text: "#856404", icon: "⏳" },
  }

  const statusInfo = statusColors[data.newStatus] || statusColors.pending
  const isTour = data.bookingType === "tour"

  const statusMessages: Record<string, string> = {
    confirmed: isTour
      ? "Great news! Your tour booking has been confirmed. Our team will contact you shortly with payment details and your complete itinerary."
      : "Great news! Your visa service request has been confirmed. Our team will contact you to schedule an appointment and collect documents.",
    processing: isTour
      ? "Your booking is now being processed. We're preparing everything for your trip!"
      : "Your visa application is now being processed. We'll keep you updated on the progress.",
    completed: isTour
      ? "Your tour has been completed! Thank you for traveling with Your Borders. We hope you had an amazing experience!"
      : "Your visa service has been completed successfully! Your documents are ready for collection.",
    cancelled: isTour
      ? "Your tour booking has been cancelled. If you have any questions or would like to rebook, please contact us."
      : "Your visa service request has been cancelled. If you have any questions or would like to resubmit, please contact us.",
  }

  const customMessage = data.message || statusMessages[data.newStatus] || "Your booking status has been updated."

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Update - Your Borders</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d6b4e 0%, #0a5a41 100%); padding: 40px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Your Borders</h1>
              <p style="margin: 8px 0 0 0; color: #a7d9c9; font-size: 14px;">Cross Borders, Not Boundaries</p>
            </td>
          </tr>
          
          <!-- Status Icon -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: ${statusInfo.bg}; border-radius: 50%; margin: 0 auto; line-height: 80px;">
                <span style="font-size: 40px;">${statusInfo.icon}</span>
              </div>
              <h2 style="margin: 20px 0 10px 0; color: #1a1a1a; font-size: 24px;">Booking Status Updated</h2>
              <div style="display: inline-block; background-color: ${statusInfo.bg}; color: ${statusInfo.text}; padding: 8px 20px; border-radius: 20px; font-size: 16px; font-weight: 600; text-transform: capitalize;">
                ${data.newStatus}
              </div>
            </td>
          </tr>
          
          <!-- Booking ID -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <div style="background-color: #f0fdf4; border: 2px dashed #0d6b4e; border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">${isTour ? "Booking" : "Request"} ID</p>
                <p style="margin: 0; color: #0d6b4e; font-size: 28px; font-weight: 700; font-family: monospace;">${data.bookingId}</p>
              </div>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px;">
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">Dear <strong>${data.customerName}</strong>,</p>
                <p style="margin: 0; color: #1a1a1a; font-size: 16px; line-height: 1.6;">${customMessage}</p>
              </div>
            </td>
          </tr>
          
          <!-- Booking Details -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #fef9e7; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">${isTour ? "Tour" : "Service"} Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">${isTour ? "Tour Package" : "Service Type"}</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.itemTitle}</td>
                  </tr>
                  ${
                    data.travelDate
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Travel Date</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.travelDate}</td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    data.serviceDate
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">Service Date</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.serviceDate}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>
            </td>
          </tr>
          
          ${
            data.newStatus === "confirmed"
              ? `
          <!-- Next Steps for Confirmed -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">What's Next?</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 28px; color: white; font-size: 14px; font-weight: bold; margin-right: 12px;">1</span>
                    <span style="color: #666666; font-size: 14px;">${isTour ? "Complete payment within 48 hours" : "Schedule your appointment"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 28px; color: white; font-size: 14px; font-weight: bold; margin-right: 12px;">2</span>
                    <span style="color: #666666; font-size: 14px;">${isTour ? "Receive your travel itinerary" : "Prepare required documents"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="display: inline-block; width: 28px; height: 28px; background-color: #0d6b4e; border-radius: 50%; text-align: center; line-height: 28px; color: white; font-size: 14px; font-weight: bold; margin-right: 12px;">3</span>
                    <span style="color: #666666; font-size: 14px;">${isTour ? "Enjoy your Thailand adventure!" : "Visit our office for processing"}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="https://yourborders.com/booking/lookup" style="display: inline-block; background-color: #0d6b4e; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Track Your ${isTour ? "Booking" : "Request"}</a>
            </td>
          </tr>
          
          <!-- Contact -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #666666; font-size: 14px;">Questions? We're here to help!</p>
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px;">📱 WhatsApp: +66 XX XXX XXXX</p>
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px;">📧 Email: support@yourborders.com</p>
              <p style="margin: 0; color: #1a1a1a; font-size: 14px;">🗣️ မြန်မာစကား ပြောဆိုနိုင်ပါသည်</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #a0a0a0; font-size: 12px;">© 2025 Your Borders. All rights reserved.</p>
              <p style="margin: 0; color: #a0a0a0; font-size: 12px;">Your trusted partner for Thailand travel & visa services</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generateStatusUpdateEmailText(data: StatusUpdateEmailData): string {
  const isTour = data.bookingType === "tour"

  return `
YOUR BORDERS - BOOKING STATUS UPDATE
=====================================

${isTour ? "Booking" : "Request"} ID: ${data.bookingId}

Dear ${data.customerName},

Your ${isTour ? "tour booking" : "visa service request"} status has been updated to: ${data.newStatus.toUpperCase()}

${isTour ? "TOUR" : "SERVICE"} DETAILS
-----------------
${isTour ? "Tour" : "Service"}: ${data.itemTitle}
${data.travelDate ? `Travel Date: ${data.travelDate}` : ""}
${data.serviceDate ? `Service Date: ${data.serviceDate}` : ""}

${data.message || ""}

NEED HELP?
----------
WhatsApp: +66 XX XXX XXXX
Email: support@yourborders.com
မြန်မာစကား ပြောဆိုနိုင်ပါသည်

Track your ${isTour ? "booking" : "request"}: https://yourborders.com/booking/lookup

Thank you for choosing Your Borders!
Cross Borders, Not Boundaries

© 2025 Your Borders. All rights reserved.
  `
}
