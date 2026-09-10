import { NextRequest, NextResponse } from "next/server"

const HELCIM_API_TOKEN = process.env.HELCIM_API_TOKEN

function extractErrorMessage(data: unknown): string {
  const d = data as Record<string, unknown> | null
  const errors = d?.errors
  if (Array.isArray(errors) && errors.length) return String(errors[0])
  if (typeof errors === "string") return errors
  if (typeof d?.message === "string") return d.message
  return "Failed to initialize payment"
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, customerName, customerEmail } = await request.json()

    if (!HELCIM_API_TOKEN) {
      return NextResponse.json({ error: "Helcim API token not configured" }, { status: 500 })
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const res = await fetch("https://api.helcim.com/v2/helcim-pay/initialize", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-token": HELCIM_API_TOKEN,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        paymentType: "purchase",
        amount: amount,
        currency: currency || "USD",
        language: "en",
        paymentMethod: "cc",
        confirmationScreen: true,
        customStyling: {
          appearance: "dark",
          brandColor: "DDBA5E",
          cornerRadius: "rounded",
          ctaButtonText: "pay",
        },
        displayContactFields: 1,
        customerRequest: {
          contactName: customerName || "Guest",
          ...(customerEmail ? {} : {}),
        },
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Helcim initialize error:", res.status, JSON.stringify(errorData))
      return NextResponse.json(
        { error: extractErrorMessage(errorData), status: res.status },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Helcim API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
