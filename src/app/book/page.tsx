"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/Footer"
import { Shield, CheckCircle, Headphones, XCircle } from "lucide-react"
import { CustomDropdown } from "@/components/ui/custom-dropdown"
import dynamic from "next/dynamic"
import type { Stop } from "@/components/BookingMap"

const BookingMap = dynamic(() => import("@/components/BookingMap"), {
  ssr: false,
})
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { TimePicker } from "@/components/ui/time-picker"

interface Car {
  id: number
  name: string
  image: string
  passenger_cap: number
  luggage_cap: number
  description: string
  category: string
  isAvailable: boolean
  vehicle_rate: string
  standard_gratuity: string
  fuel_surcharge: string
}

const serviceTypes = ["Airport Pickup", "Airport Drop-off", "Hourly Chauffeur", "Point to Point", "Wedding Service", "Corporate Event", "Special Event", "City Tour"]
const passengerOptions = ["1 Passenger", "2 Passengers", "3 Passengers", "4 Passengers", "5 Passengers", "6 Passengers", "7-10 Passengers", "10+ Passengers"]
const luggageOptions = ["No Luggage", "1-2 Bags", "3-4 Bags", "5+ Bags"]
const stepLabels = ["Trip Details", "Vehicle", "Personal Info", "Review & Pay"]

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [serviceType, setServiceType] = useState("")
  const [pickupDate, setPickupDate] = useState<Date>()
  const [pickupTime, setPickupTime] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [sameDropoff, setSameDropoff] = useState(true)
  const [stops, setStops] = useState<Stop[]>([])
  const [distanceMeters, setDistanceMeters] = useState(0)
  const [durationSeconds, setDurationSeconds] = useState(0)
  const nextStopId = useRef(1)
  const [accessible, setAccessible] = useState(false)
  const [childSeat, setChildSeat] = useState(false)
  const [childSeatType, setChildSeatType] = useState("")
  const [childSeatCount, setChildSeatCount] = useState("")
  const [passengers, setPassengers] = useState("")
  const [luggage, setLuggage] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [roundTrip, setRoundTrip] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bookingCode, setBookingCode] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [checkoutToken, setCheckoutToken] = useState("")
  const [secretToken, setSecretToken] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  useEffect(() => {
    supabase.from("cars").select("*").order("id", { ascending: true }).then(({ data }) => { if (data) setVehicles(data) })
  }, [])

  const vehicle = vehicles.find((v) => v.name === selectedVehicle)
  const vehicleRate = vehicle?.vehicle_rate || "3.50"

  const rate = parseFloat(vehicleRate) || 0
  const distMiles = distanceMeters / 1609.344
  const mileageCost = rate * distMiles
  const fuelPct = parseFloat(vehicle?.fuel_surcharge ?? "10")
  const gratuityPct = parseFloat(vehicle?.standard_gratuity ?? "18")
  const fuelSurcharge = (mileageCost * fuelPct) / 100
  const gratuity = (mileageCost * gratuityPct) / 100
  const totalQuote = mileageCost + fuelSurcharge + gratuity

  function formatDuration(sec: number): string {
    if (!sec) return "—"
    const h = Math.floor(sec / 3600)
    const m = Math.round((sec % 3600) / 60)
    if (h === 0) return `${m} min`
    return `${h}h ${m}m`
  }

  function money(n: number): string {
    return `$${n.toFixed(2)}`
  }

  function addStop() {
    const id = nextStopId.current++
    setStops((prev) => [...prev, { id, address: "", lat: 0, lng: 0 }])
  }

  function removeStop(id: number) {
    setStops((prev) => prev.filter((s) => s.id !== id))
  }

  function updateStop(id: number, address: string, lat: number, lng: number) {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, address, lat, lng } : s)))
  }

  function canNext() {
    if (step === 1) return serviceType && pickupDate && pickupTime && pickupLocation && (sameDropoff || dropoffLocation) && passengers
    if (step === 2) return !!selectedVehicle
    if (step === 3) return firstName && lastName && email && agreeTerms
    if (step === 4) return true
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError("")
    try {
      const dateStr = pickupDate ? `${pickupDate.getFullYear()}-${String(pickupDate.getMonth() + 1).padStart(2, "0")}-${String(pickupDate.getDate()).padStart(2, "0")}` : ""
      const timeStr = pickupTime.length === 5 ? `${pickupTime}:00` : pickupTime

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: serviceType,
          pickup_date: dateStr,
          pickup_time: timeStr,
          pickup_location: pickupLocation,
          dropoff_location: sameDropoff ? pickupLocation : dropoffLocation,
          passengers,
          luggage,
          special_requests: specialRequests,
          vehicle: selectedVehicle,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          company,
          price_quote: Math.round(totalQuote * 100) / 100,
          helcim_transaction_id: transactionId,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit booking")
      }
      const data = await res.json()
      setBookingCode(data.booking.booking_code)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function loadHelcimScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById("helcimpayjs-script")) { resolve(); return }
      const script = document.createElement("script")
      script.id = "helcimpayjs-script"
      script.src = "https://secure.helcim.app/helcim-pay/services/start.js"
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load HelcimPay.js"))
      document.head.appendChild(script)
    })
  }

  async function initPayment() {
    setPaymentError("")
    setProcessingPayment(true)
    try {
      await loadHelcimScript()
      const res = await fetch("/api/helcim/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totalQuote * 100) / 100,
          currency: "USD",
          customerName: `${firstName} ${lastName}`.trim() || "Guest",
          customerEmail: email,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Payment initialization failed (${res.status})`)
      }
      const data = await res.json()
      setCheckoutToken(data.checkoutToken)
      setSecretToken(data.secretToken)

      const helcimPayJsIdentifierKey = "helcim-pay-js-" + data.checkoutToken

      function handleHelcimEvent(event: MessageEvent) {
        if (event.data?.eventName === helcimPayJsIdentifierKey) {
          if (event.data.eventStatus === "SUCCESS") {
            const txData = typeof event.data.eventMessage === "string" ? JSON.parse(event.data.eventMessage) : event.data.eventMessage
            const txId = txData?.data?.data?.transactionId || txData?.transactionId || ""
            setTransactionId(txId)
            setPaymentSuccess(true)
            setPaymentError("")
            try { (window as any).removeHelcimPayIframe?.() } catch {}
          } else if (event.data.eventStatus === "ABORTED") {
            setPaymentError("Payment was declined. Please try again.")
          } else if (event.data.eventStatus === "HIDE") {
            if (!paymentSuccess) setPaymentError("Payment modal was closed. Please try again.")
          }
          setProcessingPayment(false)
          window.removeEventListener("message", handleHelcimEvent)
        }
      }

      window.addEventListener("message", handleHelcimEvent)
      try { (window as any).appendHelcimPayIframe(data.checkoutToken) } catch {}
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment initialization failed.")
      setProcessingPayment(false)
    }
  }

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />

      <section className="relative pt-[180px] pb-[100px] bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] text-center">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent" />
        <div className="max-w-6xl mx-auto px-5 relative z-[1]">
          <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] mb-[15px] font-[family-name:var(--font-playfair)]">
            Book Your <span className="text-[var(--gold-accent)]">Ride</span>
          </h1>
          <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
            Reserve your luxury transportation in minutes with our easy online booking system.
          </p>
          <div className="flex justify-center gap-2.5 mt-5 text-[0.9rem]">
            <Link href="/" className="text-[var(--soft-gray)] hover:text-[var(--gold-accent)] transition no-underline">Home</Link>
            <span className="text-[var(--gold-accent)]">/</span>
            <span className="text-[var(--gold-accent)]">Booking</span>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#0D0D0D]">
        <div className="max-w-[900px] mx-auto px-5">
          <div className="bg-gradient-to-br from-[rgba(26,26,26,0.95)] to-[rgba(13,13,13,0.95)] backdrop-blur-[30px] rounded-[25px] p-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-2 border-[rgba(221,186,94,0.2)] relative">

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(221,186,94,0.1)] border-2 border-[var(--gold-accent)] flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-[var(--gold-accent)]" />
                </div>
                <h2 className="text-white text-[2rem] font-[family-name:var(--font-playfair)] mb-4">Booking Confirmed!</h2>
                <p className="text-[var(--soft-gray)] text-[1.05rem] max-w-[500px] mx-auto mb-3">
                  Thank you, {firstName}. Your booking has been submitted successfully.
                </p>
                <p className="text-white text-[1.1rem] font-semibold mb-3">
                  Booking Code: <span className="text-[var(--gold-accent)]">{bookingCode}</span>
                </p>
                <p className="text-[var(--soft-gray)] text-[0.95rem] max-w-[500px] mx-auto mb-8">
                  A confirmation email will be sent to <span className="text-[var(--gold-accent)]">{email}</span>. Our team will contact you within 2 hours to confirm availability and provide a final quote.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-[var(--gold-accent)] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] transition-all duration-[400ms] hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] no-underline">
                    Back to Home
                  </Link>
                  <Link href="/fleet" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] transition-all duration-[400ms] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] no-underline">
                    View Fleet
                  </Link>
                </div>
              </div>
            ) : (
            <>
            {/* Step dropdown - mobile */}
            <div className="md:hidden mb-5">
              <CustomDropdown
                value={`Step ${step} — ${stepLabels[step - 1]}`}
                onChange={(val) => {
                  const num = parseInt(val.split(" — ")[0].replace("Step ", ""))
                  if (num) setStep(num)
                }}
                options={stepLabels.map((s, i) => `Step ${i + 1} — ${s}`)}
                placeholder={`Step ${step} — ${stepLabels[step - 1]}`}
              />
            </div>

            {/* Progress bar - desktop */}
            <div className="hidden md:flex justify-between items-center mb-14 px-6 relative">
              <div className="absolute top-[24px] left-6 right-6 h-[3px] bg-gradient-to-r from-[rgba(221,186,94,0.2)] to-[rgba(221,186,94,0.1)] rounded-sm" />
              {stepLabels.map((s, i) => {
                const isActive = step === i + 1
                const isCompleted = step > i + 1
                return (
                  <div key={s} className="relative z-[2] flex flex-col items-center gap-3 transition-all duration-[400ms]">
                    <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-[1rem] font-bold transition-all duration-[400ms] ${
                      isCompleted
                        ? "bg-[var(--gold-accent)] text-white border-3 border-[var(--gold-accent)]"
                        : isActive
                          ? "bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-white border-3 border-[var(--gold-accent)] shadow-[0_8px_30px_rgba(221,186,94,0.4)] scale-110"
                          : "bg-[rgba(26,26,26,0.9)] border-3 border-[rgba(221,186,94,0.3)] text-[var(--soft-gray)]"
                    }`}>
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : i + 1}
                    </div>
                    <span className={`text-[0.9rem] text-center transition-all duration-[400ms] font-medium uppercase tracking-[1px] ${
                      isActive ? "text-[var(--gold-accent)] font-semibold -translate-y-0.5" : "text-[var(--soft-gray)]"
                    }`}>{s}</span>
                  </div>
                )
              })}
            </div>

            {/* Form content */}
            <form id="bookingForm">
              {/* Step 1: Trip Details */}
              {step === 1 && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <h2 className="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
                    Trip <span className="text-[var(--gold-accent)]">Details</span>
                  </h2>
                  <p className="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Tell us about your journey</p>

                  <div className="flex flex-col gap-6">
                    {/* Service Type */}
                    <div className="flex flex-col gap-2">
                      <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1.5px]">Service Type *</label>
                      <CustomDropdown value={serviceType} onChange={setServiceType} options={serviceTypes} placeholder="Select service type" required />
                    </div>

                    {/* Date & Time row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Pickup Date *</label>
                        <Popover>
                          <PopoverTrigger render={
                            <button type="button" className="w-full flex items-center justify-between p-5 pr-14 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-[15px] text-white text-[1.05rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] cursor-pointer text-left focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none">
                              <span className={pickupDate ? "text-white font-medium" : "text-white/50 italic"}>
                                {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                              </span>
                              <svg className="absolute right-5 w-5 h-5 text-[var(--gold-accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            </button>
                          } />
                          <PopoverContent className="w-[calc(var(--anchor-width)*0.60)] p-0 bg-[#0D0D0D] border-2 border-[var(--gold-accent)] text-white" align="start">
                            <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} defaultMonth={pickupDate} classNames={{ root: "w-full" }} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Pickup Time *</label>
                        <Popover>
                          <PopoverTrigger render={
                            <button type="button" className="w-full flex items-center justify-between p-5 pr-14 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-[15px] text-white text-[1.05rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] cursor-pointer text-left focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none">
                              <span className={pickupTime ? "text-white font-medium" : "text-white/50 italic"}>
                                {pickupTime || "Select time"}
                              </span>
                              <svg className="absolute right-5 w-5 h-5 text-[var(--gold-accent)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </button>
                          } />
                          <PopoverContent className="w-auto p-4 bg-[#0D0D0D] border-2 border-[var(--gold-accent)]" align="start">
                            <TimePicker value={pickupTime} onChange={setPickupTime} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Map */}
                    <BookingMap
                      pickupLocation={pickupLocation}
                      dropoffLocation={dropoffLocation}
                      onPickupSelect={(addr) => setPickupLocation(addr)}
                      onDropoffSelect={(addr) => setDropoffLocation(addr)}
                      sameDropoff={sameDropoff}
                      onToggleSameDropoff={() => { setSameDropoff(!sameDropoff); if (!sameDropoff) { setDropoffLocation(""); setStops([]) } }}
                      stops={stops}
                      onAddStop={addStop}
                      onRemoveStop={removeStop}
                      onStopSelect={updateStop}
                      onRouteInfo={(d, t) => { setDistanceMeters(d); setDurationSeconds(t) }}
                    />

                    {/* Accessible Vehicle Toggle */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-4 cursor-pointer mb-0 normal-case tracking-normal font-medium text-[0.95rem] text-white">
                        <svg className="w-[1.1rem] h-[1.1rem] text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/></svg>
                        <span>Accessible Vehicle Needed</span>
                        <button type="button" role="switch" aria-checked={accessible} onClick={() => setAccessible(!accessible)} className={`relative inline-block w-[50px] h-[26px] shrink-0 rounded-[26px] transition-colors duration-300 cursor-pointer border-2 ${accessible ? "bg-[var(--gold-accent)] border-[var(--gold-accent)]" : "bg-[rgba(13,13,13,0.8)] border-[rgba(221,186,94,0.3)]"}`}>
                          <div className={`absolute h-[18px] w-[18px] left-[2px] bottom-[2px] rounded-full transition-all duration-300 ${accessible ? "translate-x-[24px] bg-[#0D0D0D]" : "translate-x-0 bg-[var(--soft-gray)]"}`} />
                        </button>
                      </label>
                    </div>

                    {/* Child Seat */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <button type="button" onClick={() => setChildSeat(!childSeat)} className={`inline-flex items-center gap-2 px-[22px] py-2.5 rounded-full text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 border-2 ${
                          childSeat
                            ? "bg-[var(--gold-accent)] border-[var(--gold-accent)] text-[#0D0D0D]"
                            : "bg-transparent border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/10"
                        }`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                          {childSeat ? "Remove Child Seat" : "Add Child Seat"}
                        </button>
                      </div>
                      {childSeat && (
                        <div className="bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-[15px] p-6 animate-[fadeIn_0.3s_ease]">
                          <h4 className="text-[var(--gold-accent)] text-[0.9rem] font-semibold uppercase tracking-[1px] mb-4">Child Seat Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1px]">Seat Type</label>
                              <CustomDropdown
                                value={childSeatType}
                                onChange={setChildSeatType}
                                options={["Rear Facing (Infant)", "Front Facing (Toddler)", "Booster"]}
                                placeholder="Select type"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1px]">How Many</label>
                              <CustomDropdown
                                value={childSeatCount}
                                onChange={setChildSeatCount}
                                options={["1", "2"]}
                                placeholder="Select"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Passengers & Luggage */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Number of Passengers *</label>
                        <CustomDropdown value={passengers} onChange={setPassengers} options={passengerOptions} placeholder="Select" required />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Luggage Count</label>
                        <CustomDropdown value={luggage} onChange={setLuggage} options={luggageOptions} placeholder="No Luggage" />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="flex flex-col gap-3">
                      <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Special Requests</label>
                      <textarea rows={3} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requirements or requests..." className="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] placeholder:text-white/50 placeholder:italic resize-y min-h-[120px] leading-[1.6] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Vehicle Selection */}
              {step === 2 && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <h2 className="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
                    Select Your <span className="text-[var(--gold-accent)]">Vehicle</span>
                  </h2>
                  <p className="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Choose from our luxury fleet</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-[50px]">
                    {vehicles.map((v) => {
                      const img = v.image
                      const price = v.vehicle_rate
                      const isSelected = selectedVehicle === v.name
                      return (
                        <div key={v.name} className={`relative transition-all duration-[400ms] ${!v.isAvailable ? "opacity-50 grayscale pointer-events-none" : ""}`}>
                          <input type="radio" id={v.name} name="vehicle" value={v.name} checked={isSelected} onChange={() => setSelectedVehicle(v.name)} disabled={!v.isAvailable} className="absolute opacity-0" />
                          <label htmlFor={v.name} className={`block bg-gradient-to-br from-[rgba(26,26,26,0.9)] to-[rgba(13,13,13,0.9)] border-2 rounded-[25px] p-[35px] cursor-pointer transition-all duration-[400ms] relative overflow-hidden backdrop-blur-[15px] ${
                            isSelected
                              ? "border-[var(--gold-accent)] bg-gradient-to-br from-[rgba(221,186,94,0.1)] to-[rgba(13,13,13,0.9)] shadow-[0_15px_40px_rgba(221,186,94,0.4)]"
                              : "border-[rgba(221,186,94,0.3)] hover:border-[var(--gold-accent)] hover:shadow-[0_15px_40px_rgba(221,186,94,0.3)] hover:-translate-y-[5px]"
                          } ${!v.isAvailable ? "cursor-not-allowed" : ""}`}>
                            {/* Gold top line on hover/select */}
                            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gold-accent)] via-[var(--gold-light)] to-[var(--gold-accent)] transition-transform duration-[400ms] ${isSelected || false ? "scale-x-100" : "scale-x-0"}`} />

                            {/* Image */}
                            {img && (
                              <div className="w-full h-[200px] rounded-[15px] overflow-hidden mb-5 relative">
                                <Image
                                  src={img}
                                  alt={v.name}
                                  fill
                                  className={`object-cover object-center transition-all duration-[600ms] ${
                                    v.isAvailable
                                      ? "brightness-[0.8] contrast-[1.1] group-hover:scale-110 group-hover:brightness-110"
                                      : "brightness-[0.5] contrast-[0.8] grayscale"
                                  }`}
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                            )}

                            {/* Info */}
                            <h4 className={`text-[1.5rem] mb-[15px] font-semibold transition-colors duration-300 ${isSelected ? "text-[var(--gold-accent)]" : "text-white"}`}>{v.name}</h4>
                            <div className="flex gap-[15px] mb-[15px]">
                              <span className="flex items-center gap-2 text-white/80 text-[0.9rem] bg-[rgba(221,186,94,0.15)] py-1.5 px-3 rounded-[15px] border border-[rgba(221,186,94,0.3)]">
                                <svg className="w-4 h-4 text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                {v.passenger_cap} Passengers
                              </span>
                              <span className="flex items-center gap-2 text-white/80 text-[0.9rem] bg-[rgba(221,186,94,0.15)] py-1.5 px-3 rounded-[15px] border border-[rgba(221,186,94,0.3)]">
                                <svg className="w-4 h-4 text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 3h4v3h-4V3z"/></svg>
                                {v.luggage_cap} Luggage
                              </span>
                            </div>
                            <div className="text-[1.1rem] text-[var(--gold-accent)] font-bold">
                              ${price}/mi <span className="text-[0.75rem] font-normal text-[var(--soft-gray)] opacity-80">+ fuel surcharge</span>
                            </div>
                          </label>

                          {/* Unavailable badge */}
                          {!v.isAvailable && (
                            <div className="absolute top-5 right-5 bg-gradient-to-br from-[#dc3545] to-[#c82333] text-white py-2 px-4 rounded-[20px] text-[0.85rem] font-bold uppercase tracking-[1px] shadow-[0_4px_15px_rgba(220,53,69,0.4)] z-10">
                              Unavailable
                            </div>
                          )}
                          {v.isAvailable && isSelected && (
                            <div className="absolute top-5 right-5 bg-gradient-to-br from-[#28a745] to-[#218838] text-white py-2 px-4 rounded-[20px] text-[0.85rem] font-bold uppercase tracking-[1px] shadow-[0_4px_15px_rgba(40,167,69,0.4)] z-10">
                              Selected
                            </div>
                          )}
                          {v.isAvailable && !isSelected && (
                            <div className="absolute top-5 right-5 bg-gradient-to-br from-[#28a745] to-[#218838] text-white py-2 px-4 rounded-[20px] text-[0.85rem] font-bold uppercase tracking-[1px] shadow-[0_4px_15px_rgba(40,167,69,0.4)] z-10">
                              Available
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Personal Info */}
              {step === 3 && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <h2 className="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
                    Your <span className="text-[var(--gold-accent)]">Information</span>
                  </h2>
                  <p className="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Tell us about yourself</p>

                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">First Name *</label>
                        <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Last Name *</label>
                        <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Email Address *</label>
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Phone Number</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Company Name (Optional)</label>
                      <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] font-[Inter,sans-serif] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
                    </div>
                    <div className="flex items-start gap-[15px] mb-[25px]">
                      <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} className="w-6 h-6 mt-0.5 accent-[var(--gold-accent)] cursor-pointer" />
                      <label className="cursor-pointer text-white font-normal normal-case tracking-normal leading-[1.5]">I need a round trip</label>
                    </div>
                    <div className="flex items-start gap-[15px] mb-[25px]">
                      <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-6 h-6 mt-0.5 accent-[var(--gold-accent)] cursor-pointer" />
                      <label className="cursor-pointer text-white font-normal normal-case tracking-normal leading-[1.5]">
                        I agree to the <span className="text-[var(--gold-accent)]">Terms &amp; Conditions</span> and <span className="text-[var(--gold-accent)]">Privacy Policy</span> *
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Pay */}
              {step === 4 && (
                <div className="animate-[fadeIn_0.5s_ease]">
                  <h2 className="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
                    Review &amp; <span className="text-[var(--gold-accent)]">Pay</span>
                  </h2>
                  <p className="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Review your trip details and complete your payment</p>

                  {/* Review Summary */}
                  <div className="bg-[var(--charcoal)] rounded-xl p-[30px] mb-6">
                    {/* Trip Details */}
                    <div className="mb-[30px]">
                      <h3 className="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>
                        Trip Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-[0.9rem]">
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Service Type</span>
                          <span className="text-white font-medium">{serviceType || "-"}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Date &amp; Time</span>
                          <span className="text-white font-medium">{pickupDate ? format(pickupDate, "PPP") : "-"} {pickupTime}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Pickup</span>
                          <span className="text-white font-medium">{pickupLocation || "-"}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Drop-off</span>
                          <span className="text-white font-medium">{sameDropoff ? pickupLocation : dropoffLocation || "-"}</span>
                        </div>
                        {stops.filter((s) => s.address).map((stop, i) => (
                          <div key={stop.id} className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                            <span className="text-[var(--gold-accent)]">Stop {i + 1}</span>
                            <span className="text-white font-medium">{stop.address}</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Passengers</span>
                          <span className="text-white font-medium">{passengers || "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div className="mb-[30px]">
                      <h3 className="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                        Vehicle
                      </h3>
                      <div className="text-center py-5 bg-[rgba(212,175,55,0.1)] rounded-lg text-[var(--gold-accent)] font-semibold text-[1.1rem]">
                        {selectedVehicle || "-"}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-[30px]">
                      <h3 className="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-[0.9rem]">
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Name</span>
                          <span className="text-white font-medium">{firstName} {lastName}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Email</span>
                          <span className="text-white font-medium">{email || "-"}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
                          <span className="text-[var(--soft-gray)]">Phone</span>
                          <span className="text-white font-medium">{phone || "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Extras */}
                    <div className="mb-0">
                      <h3 className="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                        Extras
                      </h3>
                      <div className="text-[0.9rem]">
                        <span className="text-[var(--soft-gray)]">Accessibility &amp; Child Seats: </span>
                        <span className="text-white font-medium">
                          {[accessible && "Accessible Vehicle", childSeat && `${childSeatCount || "?"}x ${childSeatType || "Child Seat"}`].filter(Boolean).join(", ") || "None"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-[var(--charcoal)] rounded-xl p-6 mb-6">
                    <h3 className="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.1rem] mb-5 pb-3 border-b border-[rgba(212,175,55,0.2)]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18zM6 15h12v2H6zm0-4h12v2H6zm0-4h12v2H6z"/></svg>
                      Price Breakdown
                    </h3>
                    <div className="flex flex-col gap-2.5 text-[0.95rem]">
                      {[
                        ["Distance", distanceMeters ? `${distMiles.toFixed(1)} mi` : "—"],
                        ["Est. Time", formatDuration(durationSeconds)],
                        ["Mileage Rate", `${money(rate)}/mi`],
                        ["Mileage Cost", money(distMiles ? mileageCost : 0)],
                        [`Fuel Surcharge (${fuelPct}%)`, money(distMiles ? fuelSurcharge : 0)],
                        [`Standard Gratuity (${gratuityPct}%)`, money(distMiles ? gratuity : 0)],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.08)] text-[var(--soft-gray)]">
                          <span>{l}</span>
                          <span className="text-white">{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between mt-2 pt-4 border-t-2 border-[var(--gold-accent)] font-bold text-[var(--gold-accent)] text-[1.15rem]">
                        <span>Total</span>
                        <span className="text-[1.3rem]">{money(distMiles ? totalQuote : 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* HelcimPay.js Payment */}
                  <div className="bg-[var(--charcoal)] rounded-xl p-6 mb-6">
                    <h3 className="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.1rem] mb-5 pb-3 border-b border-[rgba(212,175,55,0.2)]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                      Secure Payment
                    </h3>
                    {paymentSuccess ? (
                      <div className="flex items-center gap-3 p-4 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                        <div>
                          <p className="text-green-300 font-medium text-[0.95rem]">Payment Successful</p>
                          <p className="text-green-300/70 text-[0.85rem]">Transaction ID: {transactionId}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[var(--soft-gray)] text-[0.9rem] mb-5">
                          Click below to open the secure payment modal. Your card details are handled by Helcim and never touch our servers.
                        </p>
                        <button type="button" onClick={initPayment} disabled={processingPayment} className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-xl text-[1rem] font-semibold uppercase tracking-[1px] cursor-pointer border-none transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] hover:bg-gradient-to-br hover:from-[var(--gold-light)] hover:to-[var(--gold-accent)] disabled:opacity-50 disabled:cursor-not-allowed">
                          {processingPayment ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                              Pay with Card
                            </>
                          )}
                        </button>
                      </>
                    )}
                    {paymentError && (
                      <div className="flex items-start gap-3 mt-4 p-4 bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] rounded-xl text-[0.9rem]">
                        <span className="text-red-400">{paymentError}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary note */}
                  <div className="flex items-start gap-4 p-5 bg-[rgba(212,175,55,0.05)] rounded-lg text-[var(--soft-gray)] text-[0.95rem] leading-[1.6]">
                    <svg className="w-5 h-5 text-[var(--gold-accent)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    <p>A confirmation email will be sent to your email address. Our team will contact you within 2 hours to confirm availability and provide a final quote.</p>
                  </div>

                  {submitError && (
                    <div className="flex items-start gap-4 p-5 bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] rounded-lg text-[0.95rem] leading-[1.6] mt-4">
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-red-300">{submitError}</span>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10 pt-[30px] border-t border-[rgba(212,175,55,0.2)]">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-[var(--gold-accent)] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.15)] hover:-translate-y-0.5 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] hover:shadow-[0_12px_30px_rgba(221,186,94,0.3)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  Back
                </button>
              ) : <div />}
              <div className="flex gap-[15px]">
                {step < 4 ? (
                  <button type="button" onClick={() => setStep(step + 1)} disabled={!canNext()} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] cursor-pointer border-none transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] hover:bg-gradient-to-br hover:from-[var(--gold-light)] hover:to-[var(--gold-accent)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-gradient-to-br disabled:hover:from-[var(--gold-accent)] disabled:hover:to-[var(--gold-dark)]">
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={!paymentSuccess || submitting} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] cursor-pointer border-none transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] hover:bg-gradient-to-br hover:from-[var(--gold-light)] hover:to-[var(--gold-accent)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        Confirm Booking
                      </>
                    )}
                  </button>
                )}
              </div>
              </div>
            </>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-[80px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Secure Booking", desc: "Your information is protected with industry-standard encryption." },
            { icon: CheckCircle, title: "Instant Confirmation", desc: "Receive immediate booking confirmation via email." },
            { icon: XCircle, title: "Free Cancellation", desc: "Cancel up to 24 hours before pickup at no charge." },
            { icon: Headphones, title: "24/7 Support", desc: "Our team is available around the clock to assist you." },
          ].map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center gap-3 bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] p-6 transition-all duration-400 hover:border-[var(--gold-accent)]">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] rounded-full flex items-center justify-center">
                <b.icon className="w-5 h-5 text-[#0D0D0D]" />
              </div>
              <h4 className="text-white font-semibold text-[0.95rem]">{b.title}</h4>
              <p className="text-[var(--soft-gray)] text-[0.85rem] leading-[1.6]">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
