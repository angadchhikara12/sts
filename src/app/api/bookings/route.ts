import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

function generateBookingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function parsePassengerCount(val: string): number {
  const num = parseInt(val)
  return isNaN(num) ? 1 : num
}

function parseLuggageCount(val: string): number {
  if (!val || val === "No Luggage") return 0
  const match = val.match(/(\d+)/)
  if (!match) return 0
  const num = parseInt(match[1])
  if (val.includes("+")) return num
  if (val.includes("-")) return num
  return num
}

interface BookingRequest {
  service_type: string
  pickup_date: string
  pickup_time: string
  pickup_location: string
  dropoff_location: string
  passengers: string
  luggage: string
  special_requests: string
  vehicle: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  price_quote?: number
  helcim_transaction_id?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()

    const booking_code = generateBookingCode()

    const { data, error } = await supabaseServer
      .from("Bookings")
      .insert({
        booking_code,
        service_type: body.service_type,
        pickup_date: body.pickup_date,
        pickup_time: body.pickup_time,
        pickup_location: body.pickup_location,
        dropoff_location: body.dropoff_location,
        passengers: parsePassengerCount(body.passengers),
        luggage_count: parseLuggageCount(body.luggage),
        special_request: body.special_requests || null,
        vehicle: body.vehicle,
        first_name: body.first_name,
        last_name: body.last_name || null,
        email: body.email,
        phone_number: body.phone,
        company_name: body.company || null,
        status: "pending",
        payment_status: body.helcim_transaction_id ? "paid" : "unpaid",
        price_quote: body.price_quote ?? 0,
        helcim_transaction_id: body.helcim_transaction_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (err) {
    console.error("Booking API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
