// Creates an Airwallex payment intent and returns a hosted-checkout URL.
// Used for the Klarna (buy now, pay later) option at James Blond checkout.
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  airwallexRequest,
  corsHeaders,
  getAirwallexEnv,
  json,
  str,
} from '../_shared/airwallex.ts'


const ALLOWED_CURRENCIES = ['NZD', 'AUD', 'USD', 'GBP', 'EUR']
const MAX_AMOUNT = 20000

interface IntentResponse {
  id: string
  client_secret: string
  status?: string
  currency?: string
  amount?: number
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

  const reservationRef = str(body.reservationRef, 64).trim()
  if (!reservationRef) {
    return json({ error: 'reservationRef is required' }, 400)
  }

  const amount = Number(body.amount)
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return json({ error: 'A valid amount is required' }, 400)
  }

  const currency = (str(body.currency, 3) || 'NZD').toUpperCase()
  if (!ALLOWED_CURRENCIES.includes(currency)) {
    return json({ error: 'Unsupported currency' }, 400)
  }

  const returnUrlRaw = str(body.returnUrl, 500).trim()
  let returnUrl: URL
  try {
    returnUrl = new URL(returnUrlRaw)
  } catch {
    return json({ error: 'A valid returnUrl is required' }, 400)
  }
  const allowedHosts = ['jamesblond.co.nz', 'www.jamesblond.co.nz', 'localhost']
  const isAllowedHost =
    allowedHosts.includes(returnUrl.hostname) || returnUrl.hostname.endsWith('.lovable.app')
  if (!isAllowedHost) {
    return json({ error: 'returnUrl host is not allowed' }, 400)
  }

  const paymentMethod = (str(body.paymentMethod, 32) || 'klarna').toLowerCase()

  const customerEmail = str(body.customerEmail, 320).trim()
  const customerFirstName = str(body.customerFirstName, 100).trim()
  const customerLastName = str(body.customerLastName, 100).trim()
  const customerCountry = (str(body.customerCountry, 2) || 'NZ').toUpperCase()
  const vehicleName = str(body.vehicleName, 160).trim()

  try {
    const { checkoutBase } = getAirwallexEnv()
    const requestId = crypto.randomUUID()
    const merchantOrderId = `${reservationRef}-${Date.now()}`.slice(0, 64)

    const intent = await airwallexRequest<IntentResponse>(
      'POST',
      '/api/v1/pa/payment_intents/create',
      {
        request_id: requestId,
        amount: Number(amount.toFixed(2)),
        currency,
        merchant_order_id: merchantOrderId,
        descriptor: 'James Blond Rentals',
        return_url: returnUrl.toString(),
        metadata: {
          reservation_ref: reservationRef,
          payment_method: paymentMethod,
          vehicle: vehicleName,
        },
        order: {
          products: [
            {
              name: vehicleName || 'Vehicle rental',
              desc: `James Blond Rentals booking ${reservationRef}`,
              quantity: 1,
              unit_price: Number(amount.toFixed(2)),
              currency,
              type: 'rental',
            },
          ],
          type: 'rental',
        },
        ...(customerEmail
          ? {
              customer: {
                email: customerEmail,
                first_name: customerFirstName || undefined,
                last_name: customerLastName || undefined,
                merchant_customer_id: reservationRef,
              },
            }
          : {}),
      },
    )

    // Record the attempt so the webhook and staff have an audit trail.
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (supabaseUrl && serviceKey) {
      const admin = createClient(supabaseUrl, serviceKey)
      const { error: insertError } = await admin.from('payment_transactions').upsert(
        {
          provider: 'airwallex',
          provider_intent_id: intent.id,
          provider_payment_method: paymentMethod,
          reservation_reference: reservationRef,
          amount: Number(amount.toFixed(2)),
          currency,
          status: 'pending',
          customer_email: customerEmail || null,
          raw_payload: { merchant_order_id: merchantOrderId, request_id: requestId },
        },
        { onConflict: 'provider,provider_intent_id' },
      )
      if (insertError) {
        console.error('Failed to log payment transaction:', insertError)
      }
    }

    const successUrl = new URL(returnUrl.toString())
    successUrl.searchParams.set('provider', 'airwallex')
    successUrl.searchParams.set('intent_id', intent.id)
    successUrl.searchParams.set('awx_result', 'success')

    const failUrl = new URL(returnUrl.toString())
    failUrl.searchParams.set('provider', 'airwallex')
    failUrl.searchParams.set('intent_id', intent.id)
    failUrl.searchParams.set('awx_result', 'failed')

    const checkoutUrl =
      `${checkoutBase}/#/standalone/checkout?` +
      new URLSearchParams({
        intent_id: intent.id,
        client_secret: intent.client_secret,
        currency,
        country_code: customerCountry,
        methods: paymentMethod,
        successUrl: successUrl.toString(),
        failUrl: failUrl.toString(),
        cancelUrl: failUrl.toString(),
      }).toString()

    return json({
      status: 'OK',
      intentId: intent.id,
      merchantOrderId,
      checkoutUrl,
    })
  } catch (error) {
    console.error('Airwallex create payment failed:', error)
    return json(
      { error: error instanceof Error ? error.message : 'Failed to create Airwallex payment' },
      502,
    )
  }
})
