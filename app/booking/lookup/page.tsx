"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { getBookingByIdFromStorage, type BookingData } from "@/lib/booking-store"
import { useLocale } from "@/lib/locale-context"

export default function BookingLookupPage() {
  const { locale } = useLocale()
  const isMM = locale === "mm"

  const [bookingId, setBookingId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [error, setError] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingId.trim()) return

    setIsSearching(true)
    setError("")
    setBooking(null)

    // Small delay for UX
    setTimeout(() => {
      const foundBooking = getBookingByIdFromStorage(bookingId.trim())

      if (foundBooking) {
        setBooking(foundBooking)
      } else {
        setError(isMM ? "ဘွတ်ကင်ကို ရှာမတွေ့ပါ။ သင့် Booking ID ကို စစ်ဆေးပါ။" : "Booking not found. Please check your Booking ID.")
      }

      setIsSearching(false)
    }, 500)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: isMM ? "စောင့်ဆိုင်းဆဲ" : "Pending", variant: "secondary" as const, color: "bg-yellow-500" },
      confirmed: { label: isMM ? "အတည်ပြုပြီး" : "Confirmed", variant: "default" as const, color: "bg-green-500" },
      cancelled: { label: isMM ? "ပယ်ဖျက်ပြီး" : "Cancelled", variant: "destructive" as const, color: "bg-red-500" },
      completed: { label: isMM ? "ပြီးဆုံးပြီး" : "Completed", variant: "default" as const, color: "bg-blue-500" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant} className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  const generateWhatsAppLink = () => {
    if (!booking) return ""
    const message = encodeURIComponent(
      `Hi Your Borders Team!\n\nI'd like to check my booking status:\n\nBooking ID: ${booking.id}\nTour: ${booking.tourTitle}\nTravel Date: ${booking.travelDate}\n\nThank you!`,
    )
    return `https://wa.me/66812345678?text=${message}` // Replace with your actual WhatsApp number
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            {isMM ? "ဘွတ်ကင် ရှာဖွေရန်" : "Track Your Booking"}
          </h1>
          <p className={`text-xl text-primary-foreground/80 max-w-2xl ${isMM ? "font-myanmar" : ""}`}>
            {isMM
              ? "သင့် Booking ID ဖြင့် ဘွတ်ကင်အခြေအနေကို စစ်ဆေးပါ"
              : "Enter your Booking ID to check your booking status and details"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
                <Search className="h-5 w-5 text-primary" />
                {isMM ? "ဘွတ်ကင် ID ရိုက်ထည့်ပါ" : "Enter Booking ID"}
              </CardTitle>
              <CardDescription className={isMM ? "font-myanmar" : ""}>
                {isMM
                  ? "သင့် Booking ID ကို ဘွတ်ကင်အတည်ပြုချက်တွင် တွေ့နိုင်ပါသည်"
                  : "Your Booking ID was provided in your booking confirmation"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  placeholder={isMM ? "ဥပမာ - BK1702567890ABC123" : "e.g., BK1702567890ABC123"}
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                  className="font-mono text-lg"
                />
                <Button
                  type="submit"
                  disabled={isSearching || !bookingId.trim()}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50 mb-8">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className={`font-semibold text-red-800 ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "ဘွတ်ကင်ကို ရှာမတွေ့ပါ" : "Booking Not Found"}
                  </h3>
                  <p className={`text-sm text-red-600 ${isMM ? "font-myanmar" : ""}`}>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Details */}
          {booking && (
            <Card className="border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-2xl font-serif ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? "ဘွတ်ကင် အသေးစိတ်" : "Booking Details"}
                    </CardTitle>
                    <p className="font-mono text-primary mt-1">{booking.id}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Tour Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
                    <MapPin className="h-4 w-4 text-primary" />
                    {isMM ? "ခရီးစဉ် အချက်အလက်" : "Tour Information"}
                  </h4>
                  <div className="space-y-2">
                    <p className="font-medium text-lg">{booking.tourTitle}</p>
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

                {/* Contact Info */}
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
                        <span className="text-muted-foreground">{isMM ? "စျေးနှုန်း" : "Price"}:</span>
                        <span className="font-semibold text-primary">{booking.tourPrice}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className={`font-semibold mb-2 ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? "အထူးတောင်းဆိုချက်များ" : "Special Requests"}
                    </h4>
                    <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                  </div>
                )}

                {/* Status Message */}
                <div
                  className={`rounded-lg p-4 ${
                    booking.status === "confirmed"
                      ? "bg-green-50 border border-green-200"
                      : booking.status === "pending"
                        ? "bg-yellow-50 border border-yellow-200"
                        : booking.status === "cancelled"
                          ? "bg-red-50 border border-red-200"
                          : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className={`h-5 w-5 mt-0.5 ${
                        booking.status === "confirmed"
                          ? "text-green-600"
                          : booking.status === "pending"
                            ? "text-yellow-600"
                            : booking.status === "cancelled"
                              ? "text-red-600"
                              : "text-blue-600"
                      }`}
                    />
                    <div className={isMM ? "font-myanmar" : ""}>
                      <p className="font-medium">
                        {booking.status === "pending" &&
                          (isMM ? "သင့်ဘွတ်ကင်ကို စိစစ်နေပါသည်" : "Your booking is being reviewed")}
                        {booking.status === "confirmed" &&
                          (isMM ? "သင့်ဘွတ်ကင်ကို အတည်ပြုပြီးပါပြီ" : "Your booking is confirmed")}
                        {booking.status === "cancelled" &&
                          (isMM ? "သင့်ဘွတ်ကင်ကို ပယ်ဖျက်ပြီးပါပြီ" : "Your booking has been cancelled")}
                        {booking.status === "completed" &&
                          (isMM ? "သင့်ခရီးစဉ် ပြီးဆုံးပါပြီ" : "Your tour has been completed")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {booking.status === "pending" &&
                          (isMM ? "၂၄ နာရီအတွင်း အတည်ပြုချက် ရရှိပါမည်" : "You'll receive confirmation within 24 hours")}
                        {booking.status === "confirmed" &&
                          (isMM ? "သင့်ခရီးစဉ်အတွက် ပြင်ဆင်ပါ!" : "Get ready for your adventure!")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className={`text-muted-foreground mb-4 ${isMM ? "font-myanmar" : ""}`}>
              {isMM ? "Booking ID မရှိပါက သို့မဟုတ် အကူအညီလိုပါက" : "Don't have your Booking ID or need help?"}
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
