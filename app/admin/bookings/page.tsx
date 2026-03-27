"use client"

import { useEffect, useState, type ComponentType } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
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
  Phone,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Users,
  Wallet,
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
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "completed":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "processing":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "cancelled":
      return "border-rose-200 bg-rose-50 text-rose-700"
    default:
      return "border-slate-200 bg-slate-100 text-slate-700"
  }
}

function formatStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDashboardDate(value: string) {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
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

function OverviewCard({
  label,
  value,
  sublabel,
  icon: Icon,
}: {
  label: string
  value: string
  sublabel: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function DetailField({
  label,
  value,
}: {
  label: string
  value: string | number | undefined
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value || "-"}</p>
    </div>
  )
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
  const [lastRefreshedAt, setLastRefreshedAt] = useState("")

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
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
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

  const normalizedSearch = searchTerm.toLowerCase().trim()
  const filteredTours = tours.filter((booking) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      booking.id.toLowerCase().includes(normalizedSearch) ||
      booking.fullName.toLowerCase().includes(normalizedSearch) ||
      booking.email.toLowerCase().includes(normalizedSearch) ||
      booking.tourTitle.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredVisas = visas.filter((booking) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      booking.id.toLowerCase().includes(normalizedSearch) ||
      booking.fullName.toLowerCase().includes(normalizedSearch) ||
      booking.email.toLowerCase().includes(normalizedSearch) ||
      booking.serviceTitle.toLowerCase().includes(normalizedSearch)

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalTourRevenue = tours.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const totalVisaRevenue = visas.reduce((sum, booking) => sum + booking.servicePrice, 0)
  const overallPendingCount =
    tours.filter((booking) => booking.status === "pending").length +
    visas.filter((booking) => booking.status === "pending" || booking.status === "processing").length

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

  function handleTabChange(value: string) {
    setActiveTab(value as "tours" | "visa")
    setStatusFilter("all")
    setSearchTerm("")
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

  const visibleStatuses = activeTab === "tours" ? ["all", ...TOUR_BOOKING_STATUSES] : ["all", ...VISA_BOOKING_STATUSES]
  const activeResults = activeTab === "tours" ? filteredTours.length : filteredVisas.length
  const activeRevenue = activeTab === "tours"
    ? filteredTours.reduce((sum, booking) => sum + booking.totalPrice, 0)
    : filteredVisas.reduce((sum, booking) => sum + booking.servicePrice, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(13,107,78,0.12),transparent_45%),linear-gradient(180deg,#f8fbfa_0%,#ffffff_100%)]">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-muted-foreground shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!dashboard.authenticated) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(13,107,78,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_35%),linear-gradient(180deg,#f7fbfa_0%,#ffffff_100%)] px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_420px]">
          <Card className="overflow-hidden border-border/60 bg-card/90 shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-teal-600 p-8 text-primary-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Booking Operations
              </div>
              <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight">A cleaner control room for tours and visa requests</h1>
              <p className="mt-4 max-w-2xl text-primary-foreground/85">
                Review incoming requests, update statuses, export reports, and keep customer communication moving from
                one place.
              </p>
            </div>
            <CardContent className="grid gap-4 p-6 md:grid-cols-3">
              <OverviewCard label="Tour revenue" value={formatStoredPrice(totalTourRevenue)} sublabel="All recorded tour bookings" icon={Wallet} />
              <OverviewCard label="Visa pipeline" value={formatStoredPrice(totalVisaRevenue)} sublabel="Service fees across visa requests" icon={BarChart3} />
              <OverviewCard label="Needs attention" value={String(overallPendingCount)} sublabel="Pending and processing requests" icon={Activity} />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/95 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <p className="text-muted-foreground">Sign in to manage tour bookings and visa requests.</p>
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
              <Button className="w-full shadow-lg" onClick={() => void handleLogin()} disabled={isAuthenticating || !loginPassword}>
                {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Access Dashboard"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(13,107,78,0.14),transparent_38%),linear-gradient(180deg,#f8fbfa_0%,#ffffff_100%)]">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        <Card className="overflow-hidden border-border/60 shadow-2xl">
          <div className="bg-gradient-to-r from-primary via-teal-600 to-accent p-6 text-primary-foreground md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                  Live operations dashboard
                </div>
                <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">Manage bookings with less noise and faster follow-up</h1>
                <p className="mt-3 max-w-2xl text-primary-foreground/85">
                  Search faster, see pipeline value at a glance, and move requests through the workflow without leaving
                  the screen.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="border-white/20 bg-white/15 text-white hover:bg-white/25"
                  onClick={() => void refreshDashboard()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => void handleLogout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-primary-foreground/75">Total requests</p>
                <p className="mt-2 text-2xl font-semibold">{tours.length + visas.length}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-primary-foreground/75">Pipeline value</p>
                <p className="mt-2 text-2xl font-semibold">{formatStoredPrice(totalTourRevenue + totalVisaRevenue)}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-primary-foreground/75">Pending attention</p>
                <p className="mt-2 text-2xl font-semibold">{overallPendingCount}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-primary-foreground/75">Last refreshed</p>
                <p className="mt-2 text-2xl font-semibold">{lastRefreshedAt || "Just now"}</p>
              </div>
            </div>
          </div>
        </Card>

        {!hasDurableStorage ? (
          <Card className="mt-6 border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="flex gap-3 p-4 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Production dashboard storage is not configured yet.</p>
                <p>
                  New tour bookings and visa requests are still delivered to the admin email inbox, but they will not
                  remain here until a durable database or other persistent storage is connected.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl border border-border bg-card p-1">
              <TabsTrigger value="tours" className="rounded-xl">
                Tour Bookings ({tourStats.total})
              </TabsTrigger>
              <TabsTrigger value="visa" className="rounded-xl">
                Visa Requests ({visaStats.total})
              </TabsTrigger>
            </TabsList>

            <Card className="border-border/70 bg-card/90 shadow-sm xl:min-w-[420px]">
              <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visible results</p>
                  <p className="text-xl font-semibold">{activeResults}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{activeTab === "tours" ? "Visible booking value" : "Visible service value"}</p>
                  <p className="text-xl font-semibold">{formatStoredPrice(activeRevenue)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm text-primary">
                  <Sparkles className="h-4 w-4" />
                  Clean view, quick actions
                </div>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="tours" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <OverviewCard label="Tour bookings" value={String(tourStats.total)} sublabel="All recorded tour requests" icon={BarChart3} />
              <OverviewCard label="Pending" value={String(tourStats.pending)} sublabel="Needs team follow-up" icon={Clock} />
              <OverviewCard label="Confirmed" value={String(tourStats.confirmed)} sublabel="Ready for operations" icon={CheckCircle} />
              <OverviewCard label="Revenue" value={formatStoredPrice(totalTourRevenue)} sublabel="Gross booking value" icon={Wallet} />
            </div>

            <Card className="border-border/70 bg-card/90 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-4 md:p-5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search by ID, customer, email, or tour..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {visibleStatuses.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={statusFilter === status ? "default" : "outline"}
                        onClick={() => setStatusFilter(status)}
                      >
                        {formatStatusLabel(status)}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" onClick={exportTours}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {filteredTours.length === 0 ? (
                <Card className="border-dashed border-border/80">
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">No tour bookings match this view</p>
                      <p className="text-sm text-muted-foreground">Try clearing the search or switching the status filter.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredTours.map((booking) => (
                  <Card key={booking.id} className="border-border/70 bg-card/95 shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{booking.id}</p>
                            <Badge className={getStatusColor(booking.status)}>{formatStatusLabel(booking.status)}</Badge>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold">{booking.tourTitle}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{booking.fullName} · {booking.email}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Travel Date</p>
                          <p className="mt-2 font-medium">{booking.travelDate}</p>
                        </div>
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Guests</p>
                          <p className="mt-2 font-medium">{booking.numberOfGuests}</p>
                        </div>
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total Value</p>
                          <p className="mt-2 font-medium text-primary">{formatStoredPrice(booking.totalPrice)}</p>
                        </div>
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Created</p>
                          <p className="mt-2 font-medium">{formatDashboardDate(booking.createdAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="visa" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <OverviewCard label="Visa requests" value={String(visaStats.total)} sublabel="All recorded visa requests" icon={FileText} />
              <OverviewCard label="Pending" value={String(visaStats.pending)} sublabel="New customer requests" icon={Clock} />
              <OverviewCard label="Processing" value={String(visaStats.processing)} sublabel="Currently in progress" icon={Activity} />
              <OverviewCard label="Service value" value={formatStoredPrice(totalVisaRevenue)} sublabel="Visible visa service fees" icon={Wallet} />
            </div>

            <Card className="border-border/70 bg-card/90 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-4 md:p-5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search by ID, applicant, email, or service..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {visibleStatuses.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={statusFilter === status ? "default" : "outline"}
                        onClick={() => setStatusFilter(status)}
                      >
                        {formatStatusLabel(status)}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" onClick={exportVisas}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {filteredVisas.length === 0 ? (
                <Card className="border-dashed border-border/80">
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">No visa requests match this view</p>
                      <p className="text-sm text-muted-foreground">Try clearing the search or switching the status filter.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredVisas.map((booking) => (
                  <Card key={booking.id} className="border-border/70 bg-card/95 shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{booking.id}</p>
                            <Badge className={getStatusColor(booking.status)}>{formatStatusLabel(booking.status)}</Badge>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold">{booking.serviceTitle}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{booking.fullName} · {booking.email}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Preferred Date</p>
                          <p className="mt-2 font-medium">{booking.preferredDate}</p>
                        </div>
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current Visa</p>
                          <p className="mt-2 font-medium">{booking.currentVisaType}</p>
                        </div>
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Service Fee</p>
                          <p className="mt-2 font-medium text-primary">{formatStoredPrice(booking.servicePrice)}</p>
                        </div>
                        <div className="rounded-2xl bg-muted/40 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Created</p>
                          <p className="mt-2 font-medium">{formatDashboardDate(booking.createdAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {selectedBooking ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-border/70 shadow-2xl">
              <div className="bg-gradient-to-r from-primary to-teal-600 px-6 py-5 text-primary-foreground">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/80">{selectedBooking.id}</p>
                    <h2 className="mt-2 font-serif text-2xl font-semibold">
                      {isTourBooking(selectedBooking) ? selectedBooking.tourTitle : selectedBooking.serviceTitle}
                    </h2>
                    <p className="mt-2 text-sm text-primary-foreground/85">
                      {selectedBooking.fullName} · {selectedBooking.email}
                    </p>
                  </div>
                  <Button variant="secondary" size="icon" className="bg-white text-primary hover:bg-white/90" onClick={() => setSelectedBooking(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Card className="border-border/70 bg-muted/20 shadow-none">
                    <CardContent className="flex items-start gap-3 p-4">
                      <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</p>
                        <p className="mt-2 text-sm font-medium">{selectedBooking.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/70 bg-muted/20 shadow-none">
                    <CardContent className="flex items-start gap-3 p-4">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Phone</p>
                        <p className="mt-2 text-sm font-medium">{selectedBooking.phone}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/70 bg-muted/20 shadow-none">
                    <CardContent className="flex items-start gap-3 p-4">
                      <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Nationality</p>
                        <p className="mt-2 text-sm font-medium">{selectedBooking.nationality}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/70 bg-muted/20 shadow-none">
                    <CardContent className="flex items-start gap-3 p-4">
                      <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Created</p>
                        <p className="mt-2 text-sm font-medium">{formatDashboardDate(selectedBooking.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {isTourBooking(selectedBooking) ? (
                  <Card className="border-border/70">
                    <CardHeader>
                      <CardTitle className="text-lg">Tour Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      <DetailField label="Tour package" value={selectedBooking.tourTitle} />
                      <DetailField label="Location" value={selectedBooking.tourLocation} />
                      <DetailField label="Duration" value={selectedBooking.tourDuration} />
                      <DetailField label="Travel date" value={selectedBooking.travelDate} />
                      <DetailField label="Guests" value={selectedBooking.numberOfGuests} />
                      <DetailField label="Package price" value={formatStoredPrice(selectedBooking.tourPrice)} />
                      <DetailField label="Total" value={formatStoredPrice(selectedBooking.totalPrice)} />
                      <DetailField label="Language" value={selectedBooking.preferredLanguage} />
                      <DetailField label="Status" value={formatStatusLabel(selectedBooking.status)} />
                      {selectedBooking.specialRequests ? (
                        <div className="md:col-span-2 xl:col-span-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Special requests</p>
                          <p className="mt-2 text-sm font-medium">{selectedBooking.specialRequests}</p>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border/70">
                    <CardHeader>
                      <CardTitle className="text-lg">Visa Request Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      <DetailField label="Service" value={selectedBooking.serviceTitle} />
                      <DetailField label="Service fee" value={formatStoredPrice(selectedBooking.servicePrice)} />
                      <DetailField label="Preferred date" value={selectedBooking.preferredDate} />
                      <DetailField label="Current visa" value={selectedBooking.currentVisaType} />
                      <DetailField label="Specific visa type" value={selectedBooking.visaType} />
                      <DetailField label="Passport number" value={selectedBooking.passportNumber} />
                      <DetailField label="Visa expiry" value={selectedBooking.visaExpiryDate} />
                      <DetailField label="Language" value={selectedBooking.preferredLanguage} />
                      <DetailField label="Status" value={formatStatusLabel(selectedBooking.status)} />
                      <div className="md:col-span-2 xl:col-span-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Address in Thailand</p>
                        <p className="mt-2 text-sm font-medium">{selectedBooking.currentAddress}</p>
                      </div>
                      {selectedBooking.additionalNotes ? (
                        <div className="md:col-span-2 xl:col-span-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Additional notes</p>
                          <p className="mt-2 text-sm font-medium">{selectedBooking.additionalNotes}</p>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )}

                <Card className="border-border/70">
                  <CardHeader>
                    <CardTitle className="text-lg">Update Status & Notify Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                            formatStatusLabel(status)
                          ) : (
                            <>
                              <Send className="mr-1 h-3 w-3" />
                              {formatStatusLabel(status)}
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
              <div className="space-y-2 rounded-2xl bg-muted/50 p-4">
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
                <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-3 text-sm">
                  {statusMessage.toLowerCase().includes("could not") || statusMessage.toLowerCase().includes("required") ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              ) : null}
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => void handleStatusUpdate(false)} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Only"}
              </Button>
              <Button onClick={() => void handleStatusUpdate(true)} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update + Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
