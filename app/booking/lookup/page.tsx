"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react"

import { lookupStoredBooking } from "@/app/actions/booking"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatStoredPrice, isTourBooking, type StoredBooking } from "@/lib/booking-store"
import { useLocale } from "@/lib/locale-context"

export default function BookingLookupPage() {
  const { locale, formatPrice } = useLocale()
  const isMM = locale === "mm"

  const [bookingId, setBookingId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [booking, setBooking] = useState<StoredBooking | null>(null)
  const [error, setError] = useState("")

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!bookingId.trim()) {
      return
    }

    setIsSearching(true)
    setError("")
    setBooking(null)

    try {
      const result = await lookupStoredBooking({ bookingId: bookingId.trim() })

      if (!result.success) {
        setError(
          isMM
            ? "ဘွတ်ကင် သို့မဟုတ် တောင်းဆိုမှုကို ရှာမတွေ့ပါ။ သင့် ID ကို ပြန်စစ်ပါ။"
            : "Booking or request not found. Please check your ID.",
        )
        return
      }

      setBooking(result.booking)
    } catch (lookupError) {
      console.error("Lookup failed:", lookupError)
      setError(isMM ? "ရှာဖွေရေး မအောင်မြင်ပါ။" : "Lookup failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: isMM ? "စောင့်ဆိုင်းဆဲ" : "Pending", variant: "secondary" as const, color: "bg-yellow-500" },
      confirmed: { label: isMM ? "အတည်ပြုပြီး" : "Confirmed", variant: "default" as const, color: "bg-green-600" },
      processing: { label: isMM ? "ဆောင်ရွက်နေသည်" : "Processing", variant: "default" as const, color: "bg-blue-600" },
      cancelled: { label: isMM ? "ပယ်ဖျက်ပြီး" : "Cancelled", variant: "destructive" as const, color: "bg-red-500" },
      completed: { label: isMM ? "ပြီးဆုံးပြီး" : "Completed", variant: "default" as const, color: "bg-emerald-600" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge variant={config.variant} className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  const generateWhatsAppLink = () => {
    if (!booking) {
      return ""
    }

    const message = isTourBooking(booking)
      ? `Hi Your Borders Team!\n\nI'd like to check my booking status:\n\nBooking ID: ${booking.id}\nTour: ${booking.tourTitle}\nTravel Date: ${booking.travelDate}\n\nThank you!`
      : `Hi Your Borders Team!\n\nI'd like to check my visa request status:\n\nRequest ID: ${booking.id}\nService: ${booking.serviceTitle}\nPreferred Date: ${booking.preferredDate}\n\nThank you!`

    return `https://wa.me/66812345678?text=${encodeURIComponent(message)}`
  }

  const renderTourDetails = () => {
    if (!booking || !isTourBooking(booking)) {
      return null
    }

    return (
      <>
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
            <MapPin className="h-4 w-4 text-primary" />
            {isMM ? "ခရီးစဉ် အချက်အလက်" : "Tour Information"}
          </h4>
          <div className="space-y-2">
            <p className="font-medium text-lg">{booking.tourTitle}</p>
            <p className="text-sm text-muted-foreground">{booking.tourLocation}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(booking.travelDate).toLocaleDateString(isMM ? "my-MM" : "en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {booking.numberOfGuests} {isMM ? "ဦး" : booking.numberOfGuests === 1 ? "Guest" : "Guests"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className={`font-semibold mb-3 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "ဆက်သွယ်ရန် အချက်အလက်" : "Contact Details"}
            </h4>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{booking.fullName}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {booking.email}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {booking.phone}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className={`font-semibold mb-3 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "ဘွတ်ကင် အချက်အလက်" : "Booking Info"}
            </h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{isMM ? "ဘွတ်ကင်ရက်" : "Booked on"}:</span>
                <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">{isMM ? "စုစုပေါင်း" : "Total"}:</span>
                <span className="font-semibold text-primary">{formatPrice(booking.totalPrice)}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">{isMM ? "တစ်ဦးချင်း" : "Package Price"}:</span>
                <span>{formatStoredPrice(booking.tourPrice)}</span>
              </p>
            </div>
          </div>
        </div>

        {booking.specialRequests ? (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className={`font-semibold mb-2 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "အထူးတောင်းဆိုချက်များ" : "Special Requests"}
            </h4>
            <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
          </div>
        ) : null}
      </>
    )
  }

  const renderVisaDetails = () => {
    if (!booking || isTourBooking(booking)) {
      return null
    }

    return (
      <>
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
            <FileText className="h-4 w-4 text-primary" />
            {isMM ? "ဝန်ဆောင်မှု အချက်အလက်" : "Service Information"}
          </h4>
          <div className="space-y-2">
            <p className="font-medium text-lg">{booking.serviceTitle}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(booking.preferredDate).toLocaleDateString(isMM ? "my-MM" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {isMM ? "သက်တမ်းကုန်" : "Expiry"}: {booking.visaExpiryDate}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className={`font-semibold mb-3 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "လျှောက်ထားသူ အချက်အလက်" : "Applicant Details"}
            </h4>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{booking.fullName}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {booking.email}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {booking.phone}
              </p>
              <p className="text-muted-foreground">
                {isMM ? "ပတ်စ်ပို့" : "Passport"}: {booking.passportNumber}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className={`font-semibold mb-3 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "တောင်းဆိုမှု အချက်အလက်" : "Request Info"}
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                {isMM ? "လက်ရှိဗီဇာ" : "Current Visa"}: <span className="text-foreground">{booking.currentVisaType}</span>
              </p>
              <p className="text-muted-foreground">
                {isMM ? "အမျိုးအစားခွဲ" : "Specific Type"}: <span className="text-foreground">{booking.visaType}</span>
              </p>
              <p className="text-muted-foreground">
                {isMM ? "ဝန်ဆောင်ခ" : "Service Fee"}: <span className="font-semibold text-primary">{formatPrice(booking.servicePrice)}</span>
              </p>
              <p className="text-muted-foreground">
                {isMM ? "တင်သွင်းရက်" : "Submitted"}: <span className="text-foreground">{new Date(booking.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className={`font-semibold mb-2 ${isMM ? "font-myanmar" : ""}`}>
            {isMM ? "လိပ်စာ" : "Address"}
          </h4>
          <p className="text-sm text-muted-foreground">{booking.currentAddress}</p>
        </div>

        {booking.additionalNotes ? (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className={`font-semibold mb-2 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "မှတ်ချက်များ" : "Additional Notes"}
            </h4>
            <p className="text-sm text-muted-foreground">{booking.additionalNotes}</p>
          </div>
        ) : null}
      </>
    )
  }

  const renderStatusMessage = () => {
    if (!booking) {
      return null
    }

    const status = booking.status

    return (
      <div
        className={`rounded-lg p-4 ${
          status === "confirmed"
            ? "bg-green-50 border border-green-200"
            : status === "pending"
              ? "bg-yellow-50 border border-yellow-200"
              : status === "processing"
                ? "bg-blue-50 border border-blue-200"
                : status === "cancelled"
                  ? "bg-red-50 border border-red-200"
                  : "bg-emerald-50 border border-emerald-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <CheckCircle
            className={`h-5 w-5 mt-0.5 ${
              status === "confirmed"
                ? "text-green-600"
                : status === "pending"
                  ? "text-yellow-600"
                  : status === "processing"
                    ? "text-blue-600"
                    : status === "cancelled"
                      ? "text-red-600"
                      : "text-emerald-600"
            }`}
          />
          <div className={isMM ? "font-myanmar" : ""}>
            <p className="font-medium">
              {status === "pending" && (isMM ? "သင့်တောင်းဆိုမှုကို စိစစ်နေပါသည်" : "Your request is being reviewed")}
              {status === "confirmed" && (isMM ? "သင့်ဘွတ်ကင်ကို အတည်ပြုပြီးပါပြီ" : "Your booking is confirmed")}
              {status === "processing" && (isMM ? "သင့်တောင်းဆိုမှုကို ဆောင်ရွက်နေပါသည်" : "Your request is being processed")}
              {status === "cancelled" && (isMM ? "သင့်တောင်းဆိုမှုကို ပယ်ဖျက်ပြီးပါပြီ" : "Your request has been cancelled")}
              {status === "completed" && (isMM ? "သင့်တောင်းဆိုမှု ပြီးဆုံးပါပြီ" : "Your request has been completed")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {status === "pending" &&
                (isMM ? "မကြာခင် အတည်ပြုချက်ရရှိပါမည်။" : "We'll contact you soon with the next steps.")}
              {status === "confirmed" &&
                (isMM ? "အသေးစိတ်အချက်အလက်များကို ဆက်သွယ်အတည်ပြုပါမည်။" : "We'll follow up to confirm the remaining details.")}
              {status === "processing" &&
                (isMM ? "လက်ရှိဆောင်ရွက်မှုအခြေအနေကို မကြာခင် update လုပ်ပေးပါမည်။" : "We'll share another update as soon as processing moves forward.")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const resultTitle =
    booking?.bookingType === "visa"
      ? isMM
        ? "တောင်းဆိုမှု အသေးစိတ်"
        : "Request Details"
      : isMM
        ? "ဘွတ်ကင် အသေးစိတ်"
        : "Booking Details"

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className={isMM ? "font-myanmar" : ""}>{isMM ? "ပင်မစာမျက်နှာ" : "Back to Home"}</span>
          </Link>
          <h1
            className={`text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4 ${isMM ? "font-myanmar" : ""}`}
          >
            {isMM ? "ဘွတ်ကင် / တောင်းဆိုမှု ရှာဖွေရန်" : "Track Your Booking or Request"}
          </h1>
          <p className={`text-xl text-primary-foreground/80 max-w-2xl ${isMM ? "font-myanmar" : ""}`}>
            {isMM
              ? "Booking ID သို့မဟုတ် Request ID ဖြင့် အခြေအနေကို စစ်ဆေးပါ"
              : "Enter your Booking ID or Request ID to check the latest status"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
                <Search className="h-5 w-5 text-primary" />
                {isMM ? "ID ရိုက်ထည့်ပါ" : "Enter Your ID"}
              </CardTitle>
              <CardDescription className={isMM ? "font-myanmar" : ""}>
                {isMM
                  ? "Booking confirmation သို့မဟုတ် visa request email ထဲက ID ကို အသုံးပြုပါ"
                  : "Use the ID from your tour booking confirmation or visa request email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  placeholder={isMM ? "ဥပမာ - BKABC123 သို့မဟုတ် VSABC123" : "e.g., BKABC123 or VSABC123"}
                  value={bookingId}
                  onChange={(event) => setBookingId(event.target.value.toUpperCase())}
                  className="font-mono text-lg"
                />
                <Button type="submit" disabled={isSearching || !bookingId.trim()} className="bg-gradient-to-r from-primary to-accent">
                  {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error ? (
            <Card className="border-red-200 bg-red-50 mb-8">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className={`font-semibold text-red-800 ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "ID ကို ရှာမတွေ့ပါ" : "ID Not Found"}
                  </h3>
                  <p className={`text-sm text-red-600 ${isMM ? "font-myanmar" : ""}`}>{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {booking ? (
            <Card className="border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-2xl font-serif ${isMM ? "font-myanmar" : ""}`}>{resultTitle}</CardTitle>
                    <p className="font-mono text-primary mt-1">{booking.id}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {renderTourDetails()}
                {renderVisaDetails()}
                {renderStatusMessage()}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                    <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className={isMM ? "font-myanmar" : ""}>
                        {isMM ? "WhatsApp ဖြင့် ဆက်သွယ်ရန်" : "Contact via WhatsApp"}
                      </span>
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/contact">
                      <Mail className="h-5 w-5 mr-2" />
                      <span className={isMM ? "font-myanmar" : ""}>{isMM ? "ကျွန်ုပ်တို့ကို ဆက်သွယ်ပါ" : "Contact Us"}</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="mt-12 text-center">
            <p className={`text-muted-foreground mb-4 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "ID မရှိပါက သို့မဟုတ် အကူအညီလိုပါက" : "Don't have your ID or need help?"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <a href="https://wa.me/66812345678" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4 mr-2" />
                  +66 81 234 5678
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@yourborders.com">
                  <Mail className="h-4 w-4 mr-2" />
                  support@yourborders.com
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
