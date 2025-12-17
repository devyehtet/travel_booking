"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, ChevronLeft, ChevronRight, Check, Copy, Loader2 } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import type { Tour } from "@/lib/tour-data"
import { addBookingToStorage } from "@/lib/booking-store"
import { sendTourBookingConfirmation } from "@/app/actions/send-email"

interface BookingModalProps {
  tour: Tour | null
  isOpen: boolean
  onClose: () => void
}

function extractNumericPrice(priceString: string): number {
  const numericValue = priceString.replace(/[^\d]/g, "")
  return Number.parseInt(numericValue, 10) || 0
}

export function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
  const { locale, t, formatPrice } = useLocale()
  const isMM = locale === "mm"

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [copied, setCopied] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: isMM ? "Myanmar" : "",
    travelDate: "",
    numberOfGuests: "1",
    specialRequests: "",
  })

  const numericPrice = tour ? extractNumericPrice(tour.price) : 0
  const totalPrice = numericPrice * Number(formData.numberOfGuests || 1)

  if (!tour) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const booking = {
      id: `BK${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: "pending" as const,
      date: new Date().toISOString(),
      tour: {
        title: tour.title,
        location: tour.location,
        duration: tour.duration,
        price: tour.price,
        image: tour.image,
      },
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
      },
      travelDate: formData.travelDate,
      numberOfGuests: Number(formData.numberOfGuests),
      specialRequests: formData.specialRequests,
      totalPrice: totalPrice,
    }

    // Save to localStorage
    addBookingToStorage(booking)

    // Send confirmation emails
    try {
      const emailResult = await sendTourBookingConfirmation({
        bookingId: booking.id,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        tourName: tour.title,
        tourLocation: tour.location,
        tourDuration: tour.duration,
        travelDate: formData.travelDate,
        numberOfGuests: Number(formData.numberOfGuests),
        totalPrice: `฿${totalPrice.toLocaleString()}`,
        specialRequests: formData.specialRequests,
        nationality: formData.nationality,
      })
      setEmailSent(emailResult.success)
    } catch (error) {
      console.error("Failed to send email:", error)
    }

    setBookingId(booking.id)
    setBookingComplete(true)
    setIsSubmitting(false)
  }

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetAndClose = () => {
    setStep(1)
    setBookingComplete(false)
    setBookingId("")
    setEmailSent(false)
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      nationality: isMM ? "Myanmar" : "",
      travelDate: "",
      numberOfGuests: "1",
      specialRequests: "",
    })
    onClose()
  }

  const isStep1Valid = formData.fullName && formData.email && formData.phone
  const isStep2Valid = formData.travelDate && formData.numberOfGuests

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={isMM ? "font-myanmar" : ""}>
            {bookingComplete
              ? isMM
                ? "ဘွတ်ကင် အောင်မြင်ပါပြီ!"
                : "Booking Successful!"
              : isMM
                ? "ခရီးစဉ် ဘွတ်ကင်"
                : "Book Your Tour"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{tour.title}</p>
        </DialogHeader>

        {bookingComplete ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className={`text-lg font-semibold ${isMM ? "font-myanmar" : ""}`}>
                  {isMM ? "ကျေးဇူးတင်ပါသည်!" : "Thank You!"}
                </p>
                <p className={`text-sm text-muted-foreground ${isMM ? "font-myanmar" : ""}`}>
                  {isMM ? "သင့်ဘွတ်ကင်ကို လက်ခံရရှိပါပြီ" : "Your booking has been received"}
                </p>
                {emailSent && (
                  <p className="text-xs text-green-600 mt-1">
                    {isMM ? "အတည်ပြုအီးမေးလ် ပို့ပြီးပါပြီ!" : "Confirmation email sent!"}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isMM ? "font-myanmar" : ""}`}>{isMM ? "ဘွတ်ကင် ID" : "Booking ID"}</span>
                <div className="flex items-center gap-2">
                  <code className="bg-background px-2 py-1 rounded text-sm font-mono">{bookingId}</code>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyBookingId}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isMM ? "ခရီးစဉ်" : "Tour"}</span>
                <span>{tour.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isMM ? "ရက်စွဲ" : "Date"}</span>
                <span>{formData.travelDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isMM ? "ဧည့်သည် ဦးရေ" : "Guests"}</span>
                <span>{formData.numberOfGuests}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">{isMM ? "စုစုပေါင်း" : "Total"}:</span>
                <span className="font-semibold text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Button onClick={resetAndClose} className="w-full">
              {isMM ? "ပိတ်ရန်" : "Close"}
            </Button>
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 py-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                1
              </div>
              <div className={`w-16 h-1 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                2
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "အမည် အပြည့်အစုံ" : "Full Name"} *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder={isMM ? "သင့်အမည်ကို ထည့်ပါ" : "Enter your full name"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "အီးမေးလ်" : "Email"} *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={isMM ? "အီးမေးလ် ထည့်ပါ" : "Enter your email"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "ဖုန်းနံပါတ်" : "Phone Number"} *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={isMM ? "ဖုန်းနံပါတ် ထည့်ပါ" : "Enter phone number"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "နိုင်ငံသား" : "Nationality"}</Label>
                  <Select value={formData.nationality} onValueChange={(v) => handleInputChange("nationality", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isMM ? "နိုင်ငံ ရွေးပါ" : "Select nationality"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Myanmar">{isMM ? "မြန်မာ" : "Myanmar"}</SelectItem>
                      <SelectItem value="Thai">{isMM ? "ထိုင်း" : "Thai"}</SelectItem>
                      <SelectItem value="Other">{isMM ? "အခြား" : "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => setStep(2)} disabled={!isStep1Valid} className="w-full mt-4">
                  {isMM ? "ရှေ့သို့" : "Next"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "ခရီးသွားရက်" : "Travel Date"} *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10"
                        value={formData.travelDate}
                        onChange={(e) => handleInputChange("travelDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "လူဦးရေ" : "Travelers"} *</Label>
                    <Select
                      value={formData.numberOfGuests}
                      onValueChange={(v) => handleInputChange("numberOfGuests", v)}
                    >
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} {isMM ? "ဦး" : n === 1 ? "person" : "people"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "နိုင်ငံသားဘာသစကား" : "Nationality"}</Label>
                  <Select value={formData.nationality} onValueChange={(v) => handleInputChange("nationality", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isMM ? "နိုင်ငံ ရွေးပါ" : "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Myanmar">{isMM ? "မြန်မာ" : "Myanmar"}</SelectItem>
                      <SelectItem value="Thai">{isMM ? "ထိုင်း" : "Thai"}</SelectItem>
                      <SelectItem value="Other">{isMM ? "အခြား" : "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={isMM ? "font-myanmar" : ""}>{isMM ? "အထူးတောင်းဆိုချက်များ" : "Special Requests"}</Label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    placeholder={isMM ? "အထူးတောင်းဆိုလိုသည်များ ရှိပါက ရေးပါ..." : "Any special requests..."}
                    rows={3}
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className={`font-semibold mb-2 ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "ဈေးနှုန်း အကျဉ်းချုပ်" : "Price Summary"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {formatPrice(numericPrice)} x {formData.numberOfGuests} {isMM ? "ဦး" : "guest(s)"}
                      </span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                      <span>{isMM ? "စုစုပေါင်း" : "Total"}</span>
                      <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {isMM ? "နောက်သို့" : "Back"}
                  </Button>
                  <Button onClick={handleSubmit} disabled={!isStep2Valid || isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isMM ? "ဘတ်ကင် လုပ်နေသည်..." : "Booking..."}
                      </>
                    ) : isMM ? (
                      "ဘွတ်ကင် အတည်ပြုရန်"
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
