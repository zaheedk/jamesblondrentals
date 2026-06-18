import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

type JsonRecord = Record<string, unknown>

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback

const asNullableString = (value: unknown) =>
  typeof value === "string" && value.length > 0 ? value : null

const asPositiveInteger = (value: unknown, fallback = 1) => {
  const parsed = Number.parseInt(String(value ?? ""), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const todayIsoDate = () => new Date().toISOString().slice(0, 10)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Rental agreement save service is not configured")
    }

    const body = await req.json().catch(() => null) as JsonRecord | null
    const reservationRef = asString(body?.reservationRef).trim()
    const signatureData = (body?.signatureData && typeof body.signatureData === "object"
      ? body.signatureData
      : {}) as JsonRecord
    const insertData = (body?.insertData && typeof body.insertData === "object"
      ? body.insertData
      : {}) as JsonRecord

    const hirerSignature = asString(signatureData.hirer_signature)
    if (!reservationRef || reservationRef.length > 120) {
      return new Response(JSON.stringify({ success: false, error: "A valid reservation reference is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (!hirerSignature.startsWith("data:image/png;base64,")) {
      return new Response(JSON.stringify({ success: false, error: "A valid hirer signature is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const rentalAgreementFields = {
      booking_data: signatureData.booking_data ?? null,
      hirer_signature: hirerSignature,
      additional_driver_signature: asNullableString(signatureData.additional_driver_signature),
      signed_at: new Date().toISOString(),
      signed_by_name: asString(signatureData.signed_by_name),
      kms_out: asString(signatureData.kms_out),
      kms_in: asString(signatureData.kms_in),
      fuel_out: asString(signatureData.fuel_out),
      fuel_in: asString(signatureData.fuel_in),
      vehicle_rego: asString(signatureData.vehicle_rego),
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })

    const { data: updated, error: updateError } = await serviceClient
      .from("bookings")
      .update(rentalAgreementFields)
      .eq("reservation_reference", reservationRef)
      .select("id")

    if (updateError) {
      throw updateError
    }

    if (updated && updated.length > 0) {
      return new Response(JSON.stringify({ success: true, mode: "updated", id: updated[0].id }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const bookingInsert = {
      ...rentalAgreementFields,
      reservation_reference: reservationRef,
      booking_reference: asString(insertData.booking_reference),
      customer_first_name: asNullableString(insertData.customer_first_name),
      customer_last_name: asNullableString(insertData.customer_last_name),
      customer_email: asNullableString(insertData.customer_email),
      customer_phone: asNullableString(insertData.customer_phone),
      pickup_date: asString(insertData.pickup_date, todayIsoDate()),
      dropoff_date: asString(insertData.dropoff_date, todayIsoDate()),
      pickup_time: asString(insertData.pickup_time, "09:00"),
      dropoff_time: asString(insertData.dropoff_time, "09:00"),
      total_days: asPositiveInteger(insertData.total_days),
      vehicle_name: asNullableString(insertData.vehicle_name),
      booking_status: "confirmed",
    }

    const { data: inserted, error: insertError } = await serviceClient
      .from("bookings")
      .insert(bookingInsert)
      .select("id")
      .single()

    if (insertError) {
      throw insertError
    }

    return new Response(JSON.stringify({ success: true, mode: "inserted", id: inserted.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error saving rental agreement:", error)
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Failed to save rental agreement" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }
})