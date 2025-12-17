"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Download,
  Eye,
  Calendar,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Plane,
  X,
  Lock,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import {
  type BookingData,
  type VisaBookingData,
  getBookingsFromStorage,
  getVisaBookingsFromStorage,
  updateBookingStatusInStorage,
  updateVisaBookingStatusInStorage,
} from "@/lib/booking-store"
import { sendBookingStatusUpdate } from "@/app/actions/send-email"

const ADMIN_KEY = "yourborders2024"

export default function AdminBookingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState("")
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [visaBookings, setVisaBookings] = useState<VisaBookingData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [selectedVisaBooking, setSelectedVisaBooking] = useState<VisaBookingData | null>(null)
  const [activeTab, setActiveTab] = useState("tours")

  const [statusUpdateModal, setStatusUpdateModal] = useState<{
    open: boolean
    type: "tour" | "visa"
    bookingId: string
    customerName: string
    email: string
    itemTitle: string
    currentStatus: string
    newStatus: string
    travelDate?: string
    serviceDate?: string
  } | null>(null)
  const [customMessage, setCustomMessage] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailResult, setEmailResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handleBookingsUpdate = () => fetchBookings()
    window.addEventListener("bookings-updated", handleBookingsUpdate)
    window.addEventListener("visa-bookings-updated", handleBookingsUpdate)
    return () => {
      window.removeEventListener("bookings-updated", handleBookingsUpdate)
      window.removeEventListener("visa-bookings-updated", handleBookingsUpdate)
    }
  }, [])

  const fetchBookings = () => {
    const tourData = getBookingsFromStorage()
    const visaData = getVisaBookingsFromStorage()
    setBookings(tourData)
    setVisaBookings(visaData)
  }

  const handleLogin = () => {
    if (adminKey === ADMIN_KEY) {
      setIsAuthenticated(true)
    } else {
      alert("Invalid admin key")
    }
  }

  const handleStatusChange = (booking: BookingData, newStatus: BookingData["status"]) => {
    setStatusUpdateModal({
      open: true,
      type: "tour",
      bookingId: booking.id,
      customerName: booking.fullName,
      email: booking.email,
      itemTitle: booking.tourTitle,
      currentStatus: booking.status,
      newStatus,
      travelDate: booking.travelDate,
    })
    setCustomMessage("")
    setEmailResult(null)
  }

  const handleVisaStatusChange = (booking: VisaBookingData, newStatus: VisaBookingData["status"]) => {
    setStatusUpdateModal({
      open: true,
      type: "visa",
      bookingId: booking.id,
      customerName: booking.fullName,
      email: booking.email,
      itemTitle: booking.serviceTitle,
      currentStatus: booking.status,
      newStatus,
      serviceDate: booking.preferredDate,
    })
    setCustomMessage("")
    setEmailResult(null)
  }

  const confirmStatusUpdate = async (sendEmail: boolean) => {
    if (!statusUpdateModal) return

    setIsSendingEmail(true)
    setEmailResult(null)

    try {
      // Update status in storage
      if (statusUpdateModal.type === "tour") {
        updateBookingStatusInStorage(statusUpdateModal.bookingId, statusUpdateModal.newStatus as BookingData["status"])
        if (selectedBooking?.id === statusUpdateModal.bookingId) {
          setSelectedBooking({ ...selectedBooking, status: statusUpdateModal.newStatus as BookingData["status"] })
        }
      } else {
        updateVisaBookingStatusInStorage(
          statusUpdateModal.bookingId,
          statusUpdateModal.newStatus as VisaBookingData["status"],
        )
        if (selectedVisaBooking?.id === statusUpdateModal.bookingId) {
          setSelectedVisaBooking({
            ...selectedVisaBooking,
            status: statusUpdateModal.newStatus as VisaBookingData["status"],
          })
        }
      }

      fetchBookings()

      // Send email if requested
      if (sendEmail) {
        const result = await sendBookingStatusUpdate({
          bookingId: statusUpdateModal.bookingId,
          customerName: statusUpdateModal.customerName,
          email: statusUpdateModal.email,
          bookingType: statusUpdateModal.type,
          itemTitle: statusUpdateModal.itemTitle,
          oldStatus: statusUpdateModal.currentStatus,
          newStatus: statusUpdateModal.newStatus,
          message: customMessage || undefined,
          travelDate: statusUpdateModal.travelDate,
          serviceDate: statusUpdateModal.serviceDate,
        })

        setEmailResult(result)

        if (result.success) {
          setTimeout(() => {
            setStatusUpdateModal(null)
          }, 2000)
        }
      } else {
        setStatusUpdateModal(null)
      }
    } catch (error) {
      setEmailResult({ success: false, message: "Failed to update status" })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const getStatusColor = (status: string) => {
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredVisaBookings = visaBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToCSV = (type: "tours" | "visa") => {
    const data = type === "tours" ? filteredBookings : filteredVisaBookings
    const headers =
      type === "tours"
        ? ["ID", "Name", "Email", "Phone", "Tour", "Date", "Guests", "Price", "Status", "Created"]
        : ["ID", "Name", "Email", "Phone", "Service", "Date", "Passport", "Status", "Created"]

    const rows = data.map((b) =>
      type === "tours"
        ? [
            (b as BookingData).id,
            (b as BookingData).fullName,
            (b as BookingData).email,
            (b as BookingData).phone,
            (b as BookingData).tourTitle,
            (b as BookingData).travelDate,
            (b as BookingData).numberOfGuests,
            (b as BookingData).tourPrice,
            (b as BookingData).status,
            (b as BookingData).createdAt,
          ]
        : [
            (b as VisaBookingData).id,
            (b as VisaBookingData).fullName,
            (b as VisaBookingData).email,
            (b as VisaBookingData).phone,
            (b as VisaBookingData).serviceTitle,
            (b as VisaBookingData).preferredDate,
            (b as VisaBookingData).passportNumber,
            (b as VisaBookingData).status,
            (b as VisaBookingData).createdAt,
          ],
    )

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-bookings-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <p className="text-muted-foreground">Enter admin key to access bookings</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button className="w-full" onClick={handleLogin}>
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tourStats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  }

  const visaStats = {
    total: visaBookings.length,
    pending: visaBookings.filter((b) => b.status === "pending").length,
    processing: visaBookings.filter((b) => b.status === "processing").length,
    completed: visaBookings.filter((b) => b.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Booking Dashboard</h1>
            <p className="text-muted-foreground">Manage tour and visa service bookings</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="tours" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Tour Bookings ({tourStats.total})
            </TabsTrigger>
            <TabsTrigger value="visa" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Visa Requests ({visaStats.total})
            </TabsTrigger>
          </TabsList>

          {/* Tour Bookings Tab */}
          <TabsContent value="tours">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{tourStats.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{tourStats.pending}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{tourStats.confirmed}</p>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{tourStats.completed}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, name, email, or tour..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              <Button variant="outline" onClick={() => exportToCSV("tours")}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Bookings Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Booking ID</th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Tour</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((booking) => (
                          <tr key={booking.id} className="border-t hover:bg-muted/30">
                            <td className="p-4 font-mono text-sm">{booking.id}</td>
                            <td className="p-4">
                              <p className="font-medium">{booking.fullName}</p>
                              <p className="text-sm text-muted-foreground">{booking.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{booking.tourTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.numberOfGuests} guest(s) · {booking.tourPrice}
                              </p>
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

          {/* Visa Bookings Tab */}
          <TabsContent value="visa">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{visaStats.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{visaStats.pending}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{visaStats.processing}</p>
                      <p className="text-sm text-muted-foreground">Processing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{visaStats.completed}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, name, email, or service..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              <Button variant="outline" onClick={() => exportToCSV("visa")}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Visa Bookings Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Request ID</th>
                        <th className="text-left p-4 font-medium">Applicant</th>
                        <th className="text-left p-4 font-medium">Service</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisaBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No visa requests found
                          </td>
                        </tr>
                      ) : (
                        filteredVisaBookings.map((booking) => (
                          <tr key={booking.id} className="border-t hover:bg-muted/30">
                            <td className="p-4 font-mono text-sm">{booking.id}</td>
                            <td className="p-4">
                              <p className="font-medium">{booking.fullName}</p>
                              <p className="text-sm text-muted-foreground">{booking.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{booking.serviceTitle}</p>
                              <p className="text-sm text-muted-foreground">{booking.servicePrice}</p>
                            </td>
                            <td className="p-4">{booking.preferredDate}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedVisaBooking(booking)}>
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

        {/* Tour Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Booking Details</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">{selectedBooking.id}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
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
                  </div>
                </div>

                {/* Tour Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Tour Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Tour Package</p>
                      <p className="font-medium">{selectedBooking.tourTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Travel Date</p>
                      <p className="font-medium">{selectedBooking.travelDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <p className="font-medium">{selectedBooking.numberOfGuests} person(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium text-primary">{selectedBooking.tourPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Booked On</p>
                      <p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                    </div>
                    {selectedBooking.specialRequests && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Special Requests</p>
                        <p className="font-medium">{selectedBooking.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Update Status & Notify Customer</h3>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "confirmed", "completed", "cancelled"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedBooking.status === status ? "default" : "outline"}
                        onClick={() => handleStatusChange(selectedBooking, status as BookingData["status"])}
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
        )}

        {/* Visa Booking Detail Modal */}
        {selectedVisaBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Visa Request Details</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">{selectedVisaBooking.id}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedVisaBooking(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Applicant Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Applicant Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedVisaBooking.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nationality</p>
                      <p className="font-medium">{selectedVisaBooking.nationality}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedVisaBooking.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedVisaBooking.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Passport Number</p>
                      <p className="font-medium font-mono">{selectedVisaBooking.passportNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Visa</p>
                      <p className="font-medium">{selectedVisaBooking.currentVisaType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visa Expiry</p>
                      <p className="font-medium">{selectedVisaBooking.visaExpiryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Language</p>
                      <p className="font-medium">{selectedVisaBooking.preferredLanguage}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address in Thailand</p>
                      <p className="font-medium">{selectedVisaBooking.currentAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Service Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Service Type</p>
                      <p className="font-medium">{selectedVisaBooking.serviceTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Date</p>
                      <p className="font-medium">{selectedVisaBooking.preferredDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Service Fee</p>
                      <p className="font-medium text-primary">{selectedVisaBooking.servicePrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted On</p>
                      <p className="font-medium">{new Date(selectedVisaBooking.createdAt).toLocaleDateString()}</p>
                    </div>
                    {selectedVisaBooking.additionalNotes && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Additional Notes</p>
                        <p className="font-medium">{selectedVisaBooking.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Update Status & Notify Customer</h3>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "processing", "completed", "cancelled"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedVisaBooking.status === status ? "default" : "outline"}
                        onClick={() => handleVisaStatusChange(selectedVisaBooking, status as VisaBookingData["status"])}
                        disabled={selectedVisaBooking.status === status}
                      >
                        {selectedVisaBooking.status === status ? (
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
        )}

        <Dialog open={statusUpdateModal?.open || false} onOpenChange={(open) => !open && setStatusUpdateModal(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
              <DialogDescription>
                Change status from <Badge variant="outline">{statusUpdateModal?.currentStatus}</Badge> to{" "}
                <Badge className={getStatusColor(statusUpdateModal?.newStatus || "")}>
                  {statusUpdateModal?.newStatus}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Customer:</span>{" "}
                  <span className="font-medium">{statusUpdateModal?.customerName}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="font-medium">{statusUpdateModal?.email}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    {statusUpdateModal?.type === "tour" ? "Tour" : "Service"}:
                  </span>{" "}
                  <span className="font-medium">{statusUpdateModal?.itemTitle}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Add a personalized message to include in the email..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Leave empty to use the default message for this status.</p>
              </div>

              {emailResult && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    emailResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {emailResult.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-sm">{emailResult.message}</span>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => confirmStatusUpdate(false)} disabled={isSendingEmail}>
                Update Only (No Email)
              </Button>
              <Button onClick={() => confirmStatusUpdate(true)} disabled={isSendingEmail} className="gap-2">
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Update & Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
