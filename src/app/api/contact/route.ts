import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

interface ContactRequest {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()

    const { data, error } = await supabaseServer
      .from("Contact")
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone_number: body.phone_number || null,
        subject: body.subject,
        message: body.message,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contact: data }, { status: 201 })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
