"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Copy,
  Loader2,
  FileText,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocale } from "@/lib/locale-context"
import { createVisaBooking } from "@/app/actions/booking"
import type { VisaService } from "@/lib/visa-service-data"

interface VisaBookingModalProps {
  service: VisaService | null
  isOpen: boolean
  onClose: () => void
}

export function VisaBookingModal({ service, isOpen, onClose }: VisaBookingModalProps) {
  const { locale, formatPrice } = useLocale()
  const isMM = locale === "mm"

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<{
    success: boolean
    bookingId?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [submissionError, setSubmissionError] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "Myanmar",
    passportNumber: "",
    currentVisaType: "",
    visaExpiryDate: "",
    currentAddress: "",
    preferredDate: "",
    additionalNotes: "",
    preferredLanguage: isMM ? "myanmar" : "english",
    visaType: "",
  })

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setBookingResult(null)
      setEmailSent(false)
      setSubmissionError("")
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        nationality: "Myanmar",
        passportNumber: "",
        currentVisaType: "",
        visaExpiryDate: "",
        currentAddress: "",
        preferredDate: "",
        additionalNotes: "",
        preferredLanguage: isMM ? "myanmar" : "english",
        visaType: "",
      })
    }
  }, [isOpen, isMM])

  if (!isOpen || !service) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return

    setIsSubmitting(true)

    try {
      setSubmissionError("")

      const result = await createVisaBooking({
        serviceType: service.id,
        serviceTitle: isMM ? service.titleMM : service.title,
        servicePrice: service.price,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        passportNumber: formData.passportNumber,
        currentVisaType: formData.currentVisaType,
        visaType: formData.visaType,
        visaExpiryDate: formData.visaExpiryDate,
        currentAddress: formData.currentAddress,
        preferredDate: formData.preferredDate,
        additionalNotes: formData.additionalNotes,
        preferredLanguage: formData.preferredLanguage,
      })

      if (!result.success) {
        setSubmissionError(result.message)
        return
      }

      setBookingResult({
        success: true,
        bookingId: result.booking.id,
      })
      setEmailSent(result.emailSent)
      setStep(3)
    } catch (error) {
      console.error("Failed to submit visa request:", error)
      setSubmissionError(isMM ? "တောင်းဆိုမှု တင်သွင်းမှု မအောင်မြင်ပါ။" : "Request submission failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const copyBookingId = () => {
    if (bookingResult?.bookingId) {
      navigator.clipboard.writeText(bookingResult.bookingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello Your Borders! I just submitted a visa service request:\n\n` +
        `Request ID: ${bookingResult?.bookingId}\n` +
        `Service: ${isMM ? service.titleMM : service.title}\n` +
        `Date: ${formData.preferredDate}\n` +
        `Visa Type: ${formData.currentVisaType}\n` +
        `Specific Visa Type: ${formData.visaType}\n\n` +
        `Please confirm my request. Thank you!`,
    )
    window.open(`https://wa.me/66XXXXXXXXXX?text=${message}`, "_blank")
  }

  const visaTypes = [
    { value: "tourist", label: isMM ? "ခရီးသွား ဗီဇာ" : "Tourist Visa" },
    { value: "education", label: isMM ? "ပညာရေး ဗီဇာ" : "Education Visa" },
    { value: "business", label: isMM ? "စီးပွားရေး ဗီဇာ" : "Business Visa" },
    { value: "work", label: isMM ? "အလုပ် ဗီဇာ" : "Work Visa" },
    { value: "retirement", label: isMM ? "အငြိမ်းစား ဗီဇာ" : "Retirement Visa" },
    { value: "other", label: isMM ? "အခြား" : "Other" },
  ]

  const specificVisaTypes = isMM ? service.typesMM : service.types

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-serif font-bold text-foreground ${isMM ? "font-myanmar" : ""}`}>
                {step === 3
                  ? isMM
                    ? "တောင်းဆိုမှု လက်ခံပြီး"
                    : "Request Submitted"
                  : isMM
                    ? "ဗီဇာ ဝန်ဆောင်မှု တောင်းဆိုရန်"
                    : "Request Visa Service"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{isMM ? service.titleMM : service.title}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          {step < 3 && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 2 && <div className={`flex-1 h-1 rounded ${s < step ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {submissionError ? <p className="mb-4 text-sm text-destructive">{submissionError}</p> : null}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName" className={isMM ? "font-myanmar" : ""}>
                      {isMM ? "အမည် အပြည့်အစုံ (Passport အတိုင်း)" : "Full Name (as per Passport)"} *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder={isMM ? "အမည် ရိုက်ထည့်ပါ" : "Enter your full name"}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className={isMM ? "font-myanmar" : ""}>
                      {isMM ? "အီးမေးလ်" : "Email"} *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={isMM ? "အီးမေးလ် ရိုက်ထည့်ပါ" : "Enter your email"}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className={isMM ? "font-myanmar" : ""}>
                      {isMM ? "ဖုန်းနံပါတ်" : "Phone Number"} *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder={isMM ? "+66 XX XXX XXXX" : "+66 XX XXX XXXX"}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="passportNumber" className={isMM ? "font-myanmar" : ""}>
                      {isMM ? "ပတ်စ်ပို့ နံပါတ်" : "Passport Number"} *
                    </Label>
                    <Input
                      id="passportNumber"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      required
                      placeholder={isMM ? "ပတ်စ်ပို့ နံပါတ် ရိုက်ထည့်ပါ" : "Enter passport number"}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nationality" className={isMM ? "font-myanmar" : ""}>
                      {isMM ? "နိုင်ငံသား" : "Nationality"}
                    </Label>
                    <select
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Myanmar">Myanmar</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Visa Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentVisaType" className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "လက်ရှိ ဗီဇာ အမျိုးအစား" : "Current Visa Type"} *
                  </Label>
                  <select
                    id="currentVisaType"
                    name="currentVisaType"
                    value={formData.currentVisaType}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">{isMM ? "-- ရွေးချယ်ပါ --" : "-- Select --"}</option>
                    {visaTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="visaExpiryDate" className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "ဗီဇာ သက်တမ်းကုန်ဆုံးရက်" : "Visa Expiry Date"} *
                  </Label>
                  <Input
                    id="visaExpiryDate"
                    name="visaExpiryDate"
                    type="date"
                    value={formData.visaExpiryDate}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="currentAddress" className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "ထိုင်းနိုင်ငံ လက်ရှိနေရပ်လိပ်စာ" : "Current Address in Thailand"} *
                  </Label>
                  <textarea
                    id="currentAddress"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder={isMM ? "လိပ်စာ ရိုက်ထည့်ပါ" : "Enter your address"}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredDate" className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "နှစ်သက်သော ဝန်ဆောင်မှုရက်" : "Preferred Service Date"} *
                  </Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="preferredLanguage" className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "နှစ်သက်သောဘာသာစကား" : "Preferred Language"}
                  </Label>
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="myanmar">မြန်မာ</option>
                    <option value="english">English</option>
                    <option value="thai">ไทย</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="visaType" className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "အိုင်အရာ" : "Specific Visa Type"} *
                  </Label>
                  <select
                    id="visaType"
                    name="visaType"
                    value={formData.visaType}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">{isMM ? "-- ရွေးချယ်ပါ --" : "-- Select --"}</option>
                    {specificVisaTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="additionalNotes" className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "မှတ်ချက်များ" : "Additional Notes"}
                  </Label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows={2}
                    placeholder={isMM ? "အခြား မှတ်ချက်များ ရှိပါက ရေးပါ..." : "Any additional notes..."}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  />
                </div>

                {/* Service Summary */}
                <div className="bg-primary/5 rounded-xl p-4 space-y-3">
                  <h4 className={`font-semibold flex items-center gap-2 ${isMM ? "font-myanmar" : ""}`}>
                    <FileText className="h-4 w-4" />
                    {isMM ? "ဝန်ဆောင်မှု အကျဉ်းချုပ်" : "Service Summary"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isMM ? "ဝန်ဆောင်မှု" : "Service"}:</span>
                      <span className="font-medium">{isMM ? service.titleMM : service.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isMM ? "ကြာချိန်" : "Duration"}:</span>
                      <span>{isMM ? service.durationMM : service.duration}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                      <span>{isMM ? "ဝန်ဆောင်ခ" : "Service Fee"}</span>
                      <span className="text-primary">{formatPrice(service.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && bookingResult?.success && (
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                <div>
                  <h3 className={`text-2xl font-serif font-bold text-foreground mb-2 ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "တောင်းဆိုမှု လက်ခံပြီး!" : "Request Submitted!"}
                  </h3>
                  <p className={`text-muted-foreground ${isMM ? "font-myanmar" : ""}`}>
                    {isMM
                      ? "သင့်ဗီဇာဝန်ဆောင်မှု တောင်းဆိုမှုကို လက်ခံရရှိပါပြီ။ ၂၄ နာရီအတွင်း ဆက်သွယ်ပါမည်။"
                      : "Your visa service request has been received. We'll contact you within 24 hours."}
                  </p>
                </div>

                {emailSent && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <Mail className="h-4 w-4" />
                    <span className={isMM ? "font-myanmar" : ""}>
                      {isMM ? "အတည်ပြုအီးမေးလ် ပို့ပြီးပါပြီ!" : "Confirmation email sent!"}
                    </span>
                  </div>
                )}

                {/* Booking ID */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className={`text-sm text-muted-foreground mb-2 ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "သင်၏ တောင်းဆိုမှု ID" : "Your Request ID"}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="font-mono text-xl font-bold text-primary">{bookingResult.bookingId}</p>
                    <Button variant="ghost" size="sm" onClick={copyBookingId} className="h-8 w-8 p-0">
                      <Copy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
                    </Button>
                  </div>
                  {copied && (
                    <p className={`text-xs text-green-500 mt-1 ${isMM ? "font-myanmar" : ""}`}>
                      {isMM ? "ကူးယူပြီးပါပြီ!" : "Copied!"}
                    </p>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-primary/5 rounded-lg p-4 text-left">
                  <h4 className={`font-semibold mb-3 ${isMM ? "font-myanmar" : ""}`}>
                    {isMM ? "တောင်းဆိုမှု အကျဉ်းချုပ်" : "Request Summary"}
                  </h4>
                  <div className={`space-y-2 text-sm ${isMM ? "font-myanmar" : ""}`}>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isMM ? "ဝန်ဆောင်မှု" : "Service"}:</span>
                      <span className="font-medium">{isMM ? service.titleMM : service.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isMM ? "ရက်စွဲ" : "Date"}:</span>
                      <span>{new Date(formData.preferredDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isMM ? "ဗီဇာ အမျိုးအစား" : "Visa Type"}:</span>
                      <span>{formData.currentVisaType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isMM ? "အိုင်အရာ" : "Specific Visa Type"}:</span>
                      <span>{formData.visaType}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-semibold">{isMM ? "ဝန်ဆောင်ခ" : "Service Fee"}:</span>
                      <span className="font-semibold text-primary">{formatPrice(service.price)}</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Share */}
                <Button onClick={shareViaWhatsApp} variant="outline" className="w-full gap-2 bg-transparent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-green-500">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className={isMM ? "font-myanmar" : ""}>
                    {isMM ? "WhatsApp မှာ မျှဝေရန်" : "Share via WhatsApp"}
                  </span>
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="border-t p-4 flex gap-3">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1 gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className={isMM ? "font-myanmar" : ""}>{isMM ? "နောက်သို့" : "Back"}</span>
              </Button>
            )}

            {step === 1 && (
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.fullName || !formData.email || !formData.phone || !formData.passportNumber}
                className="flex-1 gap-2"
              >
                <span className={isMM ? "font-myanmar" : ""}>{isMM ? "ရှေ့ဆက်ရန်" : "Continue"}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {step === 2 && (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !formData.currentVisaType ||
                  !formData.visaExpiryDate ||
                  !formData.currentAddress ||
                  !formData.preferredDate ||
                  !formData.visaType
                }
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className={isMM ? "font-myanmar" : ""}>{isMM ? "တင်သွင်းနေသည်..." : "Submitting..."}</span>
                  </>
                ) : (
                  <>
                    <span className={isMM ? "font-myanmar" : ""}>{isMM ? "တောင်းဆိုမှု တင်သွင်းရန်" : "Submit Request"}</span>
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="border-t p-4">
            <Button onClick={onClose} className="w-full">
              <span className={isMM ? "font-myanmar" : ""}>{isMM ? "ပိတ်ရန်" : "Close"}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
