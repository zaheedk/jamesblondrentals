// Retrieves an Airwallex payment intent and returns a normalised status
// so the browser can continue the booking flow immediately after redirect.
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  airwallexRequest,
  corsHeaders,
  json,
  normaliseIntentStatus,
  str,
} from '../_shared/airwallex.ts'

interface IntentResponse {
  id: string
  status?: string
  amount?: number
  currency?: string
  merchant_order_id?: string
  latest_payment_attempt?: {
    payment_method?: { type?: string }
    status?: string
  }
  metadata?: Record<string, unknown>
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON in request body' }, 400)
  }

  const intentId = str(body.intentId, 64).trim()
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(intentId)) {
    return json({ error: 'A valid intentId is required' }, 400)
  }

  try {
    const intent = await airwallexRequest<IntentResponse>(
      'GET',
      `/api/v1/pa/payment_intents/${intentId}`,
    )

    const paymentStatus = normaliseIntentStatus(intent.status)
    const paymentMethod = intent.latest_payment_attempt?.payment_method?.type || null
    const reservationRef =
      typeof intent.metadata?.reservation_ref === 'string' ? intent.metadata.reservation_ref : null

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (supabaseUrl && serviceKey) {
      const admin = createClient(supabaseUrl, serviceKey)
      const { error: upsertError } = await admin.from('payment_transactions').upsert(
        {
          provider: 'airwallex',
          provider_intent_id: intent.id,
          provider_payment_method: paymentMethod,
          reservation_reference: reservationRef,
          amount: Number(intent.amount ?? 0),
          currency: intent.currency || 'NZD',
          status: paymentStatus.toLowerCase(),
          raw_payload: intent as unknown as Record<string, unknown>,
        },
        { onConflict: 'provider,provider_intent_id' },
      )
      if (upsertError) {
        console.error('Failed to update payment transaction:', upsertError)
      }
    }

    return json({
      status: 'OK',
      intentId: intent.id,
      paymentStatus,
      airwallexStatus: intent.status || 'UNKNOWN',
      amount: intent.amount ?? null,
      currency: intent.currency ?? null,
      paymentMethod,
      reservationRef,
      merchantOrderId: intent.merchant_order_id ?? null,
    })
  } catch (error) {
    console.error('Airwallex verify payment failed:', error)
    return json(
      { error: error instanceof Error ? error.message : 'Failed to verify Airwallex payment' },
      502,
    )
  }
})
