// Airwallex webhook receiver: verifies the signature, records the payment,
// and marks the matching booking as paid/failed.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { normaliseIntentStatus } from '../_shared/airwallex.ts'

const webhookHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-timestamp, x-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...webhookHeaders, 'Content-Type': 'application/json' },
  })

const encoder = new TextEncoder()

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: webhookHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const secret = Deno.env.get('AIRWALLEX_WEBHOOK_SECRET')
  if (!secret) {
    console.error('AIRWALLEX_WEBHOOK_SECRET not configured')
    return json({ error: 'Webhook not configured' }, 500)
  }

  const timestamp = req.headers.get('x-timestamp') || ''
  const signature = (req.headers.get('x-signature') || '').toLowerCase()
  const rawBody = await req.text()

  if (!timestamp || !signature) {
    return json({ error: 'Missing signature headers' }, 401)
  }

  const expected = await hmacHex(secret, `${timestamp}${rawBody}`)
  if (!timingSafeEqual(expected, signature)) {
    console.error('Airwallex webhook signature mismatch')
    return json({ error: 'Invalid signature' }, 401)
  }

  let event: Record<string, any>
  try {
    event = JSON.parse(rawBody)
  } catch {
    return json({ error: 'Invalid JSON payload' }, 400)
  }

  const eventName: string = typeof event.name === 'string' ? event.name : ''
  const data = event.data?.object ?? {}
  const intentId: string | null = typeof data.id === 'string' ? data.id : null
  const reservationRef: string | null =
    typeof data.metadata?.reservation_ref === 'string' ? data.metadata.reservation_ref : null

  console.log('Airwallex webhook received:', eventName, intentId, reservationRef)

  // Only payment intent lifecycle events change booking state.
  if (!eventName.startsWith('payment_intent.') || !intentId) {
    return json({ received: true, ignored: true })
  }

  const intentStatus: string | undefined =
    typeof data.status === 'string' ? data.status : undefined
  let paymentStatus = normaliseIntentStatus(intentStatus)
  if (eventName === 'payment_intent.succeeded') paymentStatus = 'Approved'
  if (eventName === 'payment_intent.failed' || eventName === 'payment_intent.cancelled') {
    paymentStatus = 'Failed'
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('Supabase service credentials missing')
    return json({ error: 'Server not configured' }, 500)
  }
  const admin = createClient(supabaseUrl, serviceKey)

  const { error: upsertError } = await admin.from('payment_transactions').upsert(
    {
      provider: 'airwallex',
      provider_intent_id: intentId,
      provider_payment_method:
        data.latest_payment_attempt?.payment_method?.type ??
        (typeof data.metadata?.payment_method === 'string' ? data.metadata.payment_method : null),
      reservation_reference: reservationRef,
      amount: Number(data.amount ?? 0),
      currency: typeof data.currency === 'string' ? data.currency : 'NZD',
      status: paymentStatus.toLowerCase(),
      raw_payload: event,
    },
    { onConflict: 'provider,provider_intent_id' },
  )
  if (upsertError) {
    console.error('Failed to record webhook transaction:', upsertError)
  }

  if (reservationRef) {
    const { data: updated, error: rpcError } = await admin.rpc(
      'update_booking_payment_status_by_reference',
      {
        _references: [reservationRef],
        _payment_status: paymentStatus === 'Approved' ? 'paid' : 'failed',
        _booking_status: paymentStatus === 'Approved' ? 'confirmed' : 'pending',
        _payment_intent_id: intentId,
        _reservation_reference: reservationRef,
      },
    )
    if (rpcError) {
      console.error('Failed to update booking from webhook:', rpcError)
    } else {
      console.log('Bookings updated from Airwallex webhook:', updated)
    }
  }

  return json({ received: true })
})
