"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Globe,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Users,
  X,
} from "lucide-react"

import {
  getAdminDashboardData,
  loginAdmin,
  logoutAdmin,
  updateStoredBookingStatus,
} from "@/app/actions/booking"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  TOUR_BOOKING_STATUSES,
  VISA_BOOKING_STATUSES,
  formatStoredPrice,
  isTourBooking,
  type BookingData,
  type StoredBooking,
  type VisaBookingData,
} from "@/lib/booking-store"

type DashboardState =
  | { authenticated: false }
  | {
      authenticated: true
      tours: BookingData[]
      visas: VisaBookingData[]
      hasDurableStorage: boolean
    }

type PendingStatusUpdate =
  | {
      bookingType: "tour"
      bookingId: string
      currentStatus: BookingData["status"]
      newStatus: BookingData["status"]
      customerName: string
      email: string
      itemTitle: string
    }
  | {
      bookingType: "visa"
      bookingId: string
      currentStatus: VisaBookingData["status"]
      newStatus: VisaBookingData["status"]
      customerName: string
      email: string
      itemTitle: string
    }

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function downloadCsv(fileName: string, rows: string[][]) {
  const content = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n")

  const blob = new Blob([content], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function AdminBookingsPage() {
  const [dashboard, setDashboard] = useState<DashboardState>({ authenticated: false })
  const [isLoading, setIsLoading] = useState(true)
  const [loginPassword, setLoginPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [activeTab, setActiveTab] = useState<"tours" | "visa">("tours")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<StoredBooking | null>(null)
  const [pendingUpdate, setPendingUpdate] = useState<PendingStatusUpdate | null>(null)
  const [customMessage, setCustomMessage] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  async function refreshDashboard() {
    setIsLoading(true)
    try {
      const result = await getAdminDashboardData()

      if (!result.authenticated) {
        setDashboard({ authenticated: false })
        setSelectedBooking(null)
        setPendingUpdate(null)
        return
      }

      setDashboard({
        authenticated: true,
        tours: result.tours,
        visas: result.visas,
        hasDurableStorage: result.hasDurableStorage,
      })
    } catch (error) {
      console.error("Failed to load admin dashboard:", error)
      setDashboard({ authenticated: false })
      setSelectedBooking(null)
      setPendingUpdate(null)
      setLoginMessage("Dashboard temporarily unavailable. Please refresh and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshDashboard()
  }, [])

  const tours = dashboard.authenticated ? dashboard.tours : []
  const visas = dashboard.authenticated ? dashboard.visas : []
  const hasDurableStorage = dashboard.authenticated ? dashboard.hasDurableStorage : false

  const normalizedSearch = searchTerm.toLowerCase()
  const filteredTours = tours.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(normalizedSearch) ||
      booking.fullName.toLowerCase().includes(normalizedSearch) ||
      booking.email.toLowerCase().includes(normalizedSearch) ||
      booking.tourTitle.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredVisas = visas.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(normalizedSearch) ||
      booking.fullName.toLowerCase().includes(normalizedSearch) ||
      booking.email.toLowerCase().includes(normalizedSearch) ||
      booking.serviceTitle.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const tourStats = {
    total: tours.length,
    pending: tours.filter((booking) => booking.status === "pending").length,
    confirmed: tours.filter((booking) => booking.status === "confirmed").length,
    completed: tours.filter((booking) => booking.status === "completed").length,
  }

  const visaStats = {
    total: visas.length,
    pending: visas.filter((booking) => booking.status === "pending").length,
    processing: visas.filter((booking) => booking.status === "processing").length,
    completed: visas.filter((booking) => booking.status === "completed").length,
  }

  async function handleLogin() {
    setIsAuthenticating(true)
    setLoginMessage("")

    try {
      const result = await loginAdmin({ password: loginPassword })
      setLoginMessage(result.message)

      if (result.success) {
        setLoginPassword("")
        await refreshDashboard()
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function handleLogout() {
    await logoutAdmin()
    setDashboard({ authenticated: false })
    setSelectedBooking(null)
    setPendingUpdate(null)
    setLoginMessage("")
  }

  function openStatusUpdate(booking: StoredBooking, newStatus: string) {
    setStatusMessage("")

    if (isTourBooking(booking)) {
      setPendingUpdate({
        bookingType: "tour",
        bookingId: booking.id,
        currentStatus: booking.status,
        newStatus: newStatus as BookingData["status"],
        customerName: booking.fullName,
        email: booking.email,
        itemTitle: booking.tourTitle,
      })
      return
    }

    setPendingUpdate({
      bookingType: "visa",
      bookingId: booking.id,
      currentStatus: booking.status,
      newStatus: newStatus as VisaBookingData["status"],
      customerName: booking.fullName,
      email: booking.email,
      itemTitle: booking.serviceTitle,
    })
  }

  async function handleStatusUpdate(sendEmail: boolean) {
    if (!pendingUpdate) {
      return
    }

    setIsUpdatingStatus(true)
    setStatusMessage("")

    try {
      const result =
        pendingUpdate.bookingType === "tour"
          ? await updateStoredBookingStatus({
              bookingType: "tour",
              bookingId: pendingUpdate.bookingId,
              newStatus: pendingUpdate.newStatus,
              sendEmail,
              message: customMessage,
            })
          : await updateStoredBookingStatus({
              bookingType: "visa",
              bookingId: pendingUpdate.bookingId,
              newStatus: pendingUpdate.newStatus,
              sendEmail,
              message: customMessage,
            })

      setStatusMessage(result.message)

      if (!result.success) {
        return
      }

      if (selectedBooking?.id === result.booking.id) {
        setSelectedBooking(result.booking)
      }

      await refreshDashboard()

      if (!sendEmail || result.emailSent) {
        setTimeout(() => {
          setPendingUpdate(null)
          setCustomMessage("")
          setStatusMessage("")
        }, 1200)
      }
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  function exportTours() {
    const rows = [
      ["Booking ID", "Customer", "Email", "Phone", "Tour", "Travel Date", "Guests", "Total", "Status", "Created"],
      ...filteredTours.map((booking) => [
        booking.id,
        booking.fullName,
        booking.email,
        booking.phone,
        booking.tourTitle,
        booking.travelDate,
        String(booking.numberOfGuests),
        formatStoredPrice(booking.totalPrice),
        booking.status,
        booking.createdAt,
      ]),
    ]

    downloadCsv(`tour-bookings-${new Date().toISOString().split("T")[0]}.csv`, rows)
  }

  function exportVisas() {
    const rows = [
      ["Request ID", "Applicant", "Email", "Phone", "Service", "Preferred Date", "Passport", "Fee", "Status", "Created"],
      ...filteredVisas.map((booking) => [
        booking.id,
        booking.fullName,
        booking.email,
        booking.phone,
        booking.serviceTitle,
        booking.preferredDate,
        booking.passportNumber,
        formatStoredPrice(booking.servicePrice),
        booking.status,
        booking.createdAt,
      ]),
    ]

    downloadCsv(`visa-requests-${new Date().toISOString().split("T")[0]}.csv`, rows)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!dashboard.authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <p className="text-muted-foreground">Sign in to review tour bookings and visa requests.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleLogin()
                }
              }}
            />
            {loginMessage ? <p className="text-sm text-muted-foreground">{loginMessage}</p> : null}
            <Button className="w-full" onClick={() => void handleLogin()} disabled={isAuthenticating || !loginPassword}>
              {isAuthenticating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const visibleStatuses = activeTab === "tours" ? ["all", ...TOUR_BOOKING_STATUSES] : ["all", ...VISA_BOOKING_STATUSES]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Booking Dashboard</h1>
            <p className="text-muted-foreground">Manage tour bookings and visa requests stored on the server.</p>
          </div>
          <Button variant="outline" onClick={() => void handleLogout()}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {!hasDurableStorage ? (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="flex gap-3 p-4 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Production dashboard storage is not configured yet.</p>
                <p>
                  New tour bookings and visa requests are still delivered to the admin email inbox, but they will not
                  remain in this dashboard until a durable database or other persistent storage is connected.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "tours" | "visa")}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="tours">Tour Bookings ({tourStats.total})</TabsTrigger>
            <TabsTrigger value="visa">Visa Requests ({visaStats.total})</TabsTrigger>
          </TabsList>

          <TabsContent value="tours" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{tourStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{tourStats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{tourStats.confirmed}</p>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{tourStats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search by ID, name, email, or tour..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleStatuses.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? "default" : "outline"}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              <Button variant="outline" onClick={exportTours}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Booking ID</th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Tour</th>
                        <th className="text-left p-4 font-medium">Travel Date</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTours.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No tour bookings found.
                          </td>
                        </tr>
                      ) : (
                        filteredTours.map((booking) => (
                          <tr key={booking.id} className="border-t hover:bg-muted/30">
                            <td className="p-4 font-mono text-sm">{booking.id}</td>
                            <td className="p-4">
                              <p className="font-medium">{booking.fullName}</p>
                              <p className="text-sm text-muted-foreground">{booking.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{booking.tourTitle}</p>
                              <p className="text-sm text-muted-foreground">{formatStoredPrice(booking.totalPrice)}</p>
                            </td>
                            <td className="p-4">{booking.travelDate}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visa" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{visaStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{visaStats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{visaStats.processing}</p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{visaStats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search by ID, name, email, or service..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleStatuses.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? "default" : "outline"}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              <Button variant="outline" onClick={exportVisas}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Request ID</th>
                        <th className="text-left p-4 font-medium">Applicant</th>
                        <th className="text-left p-4 font-medium">Service</th>
                        <th className="text-left p-4 font-medium">Preferred Date</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisas.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No visa requests found.
                          </td>
                        </tr>
                      ) : (
                        filteredVisas.map((booking) => (
                          <tr key={booking.id} className="border-t hover:bg-muted/30">
                            <td className="p-4 font-mono text-sm">{booking.id}</td>
                            <td className="p-4">
                              <p className="font-medium">{booking.fullName}</p>
                              <p className="text-sm text-muted-foreground">{booking.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{booking.serviceTitle}</p>
                              <p className="text-sm text-muted-foreground">{formatStoredPrice(booking.servicePrice)}</p>
                            </td>
                            <td className="p-4">{booking.preferredDate}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedBooking ? (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{isTourBooking(selectedBooking) ? "Booking Details" : "Visa Request Details"}</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{selectedBooking.id}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedBooking.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">{selectedBooking.nationality}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p>{selectedBooking.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p>{selectedBooking.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <p>{selectedBooking.preferredLanguage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p>{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {isTourBooking(selectedBooking) ? (
                  <div className="grid md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Tour Package</p>
                      <p className="font-medium">{selectedBooking.tourTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedBooking.tourLocation}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedBooking.tourDuration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Travel Date</p>
                      <p className="font-medium">{selectedBooking.travelDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <p className="font-medium">{selectedBooking.numberOfGuests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Package Price</p>
                      <p className="font-medium">{formatStoredPrice(selectedBooking.tourPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium text-primary">{formatStoredPrice(selectedBooking.totalPrice)}</p>
                    </div>
                    {selectedBooking.specialRequests ? (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Special Requests</p>
                        <p className="font-medium">{selectedBooking.specialRequests}</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-medium">{selectedBooking.serviceTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Date</p>
                      <p className="font-medium">{selectedBooking.preferredDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Service Fee</p>
                      <p className="font-medium text-primary">{formatStoredPrice(selectedBooking.servicePrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Visa</p>
                      <p className="font-medium">{selectedBooking.currentVisaType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Specific Visa Type</p>
                      <p className="font-medium">{selectedBooking.visaType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Passport Number</p>
                      <p className="font-medium font-mono">{selectedBooking.passportNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visa Expiry Date</p>
                      <p className="font-medium">{selectedBooking.visaExpiryDate}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Address in Thailand</p>
                      <p className="font-medium">{selectedBooking.currentAddress}</p>
                    </div>
                    {selectedBooking.additionalNotes ? (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Additional Notes</p>
                        <p className="font-medium">{selectedBooking.additionalNotes}</p>
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold">Update Status & Notify Customer</h3>
                  <div className="flex flex-wrap gap-2">
                    {(isTourBooking(selectedBooking) ? TOUR_BOOKING_STATUSES : VISA_BOOKING_STATUSES).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedBooking.status === status ? "default" : "outline"}
                        onClick={() => openStatusUpdate(selectedBooking, status)}
                        disabled={selectedBooking.status === status}
                      >
                        {selectedBooking.status === status ? (
                          status.charAt(0).toUpperCase() + status.slice(1)
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-1" />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <Dialog open={Boolean(pendingUpdate)} onOpenChange={(open) => !open && setPendingUpdate(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
              <DialogDescription>
                Change status from <Badge variant="outline">{pendingUpdate?.currentStatus}</Badge> to{" "}
                <Badge className={getStatusColor(pendingUpdate?.newStatus || "")}>{pendingUpdate?.newStatus}</Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Customer:</span>{" "}
                  <span className="font-medium">{pendingUpdate?.customerName}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="font-medium">{pendingUpdate?.email}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">{pendingUpdate?.bookingType === "tour" ? "Tour" : "Service"}:</span>{" "}
                  <span className="font-medium">{pendingUpdate?.itemTitle}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Add a personalized note for the customer..."
                  value={customMessage}
                  onChange={(event) => setCustomMessage(event.target.value)}
                  rows={3}
                />
              </div>

              {statusMessage ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                  {statusMessage.toLowerCase().includes("could not") || statusMessage.toLowerCase().includes("required") ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              ) : null}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => void handleStatusUpdate(false)} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Only"}
              </Button>
              <Button onClick={() => void handleStatusUpdate(true)} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update + Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
