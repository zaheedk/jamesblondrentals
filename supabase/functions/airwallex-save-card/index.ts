// Saves a customer's card on file with Airwallex (payment consent) so staff can
// collect payment at pick-up. Card numbers never touch James Blond systems —
// the customer enters them on Airwallex's secure hosted page.
//   action "start"   -> returns a secure Airwallex link
//   action "confirm" -> reads the verified consent back and stores brand/last4
import { createClient } from 'npm:@supabase/supabase-js@2'
import { airwallexRequest, corsHeaders, getAirwallexEnv, json, str } from '../_shared/airwallex.ts'

interface Customer { id: string; client_secret?: string }
interface Consent { id: string; status: string; created_at?: string; payment_method?: { id?: string; card?: Card } }
interface Card { brand?: string; last4?: string; expiry_month?: string; expiry_year?: string }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const authHeader = req.headers.get('Authorization') || ''
  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return json({ error: 'Please sign in first' }, 401)

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const action = str(body.action, 16)
  const admin = createClient(url, serviceKey)

  const { data: existing } = await admin
    .from('saved_payment_methods').select('*').eq('user_id', user.id).maybeSingle()

  try {
    if (action === 'start') {
      let returnUrl: URL
      try { returnUrl = new URL(str(body.returnUrl, 500)) } catch { return json({ error: 'Invalid returnUrl' }, 400) }
      const okHost = ['jamesblond.co.nz', 'www.jamesblond.co.nz', 'localhost'].includes(returnUrl.hostname) ||
        returnUrl.hostname.endsWith('.lovable.app') || returnUrl.hostname.endsWith('.lovableproject.com')
      if (!okHost) return json({ error: 'returnUrl host is not allowed' }, 400)

      let customerId = existing?.provider_customer_id as string | undefined
      if (!customerId) {
        const c = await airwallexRequest<Customer>('POST', '/api/v1/pa/customers/create', {
          request_id: crypto.randomUUID(),
          merchant_customer_id: user.id,
          email: user.email,
        })
        customerId = c.id
        await admin.from('saved_payment_methods').upsert(
          { user_id: user.id, provider_customer_id: customerId, status: 'pending' },
          { onConflict: 'user_id' },
        )
      }
      const secret = await airwallexRequest<{ client_secret: string }>(
        'GET', `/api/v1/pa/customers/${customerId}/generate_client_secret`,
      )

      const ok = new URL(returnUrl.toString()); ok.searchParams.set('card_result', 'success')
      const fail = new URL(returnUrl.toString()); fail.searchParams.set('card_result', 'failed')
      const { checkoutBase } = getAirwallexEnv()
      const checkoutUrl = `${checkoutBase}/#/standalone/checkout?` + new URLSearchParams({
        mode: 'recurring',
        client_secret: secret.client_secret,
        customer_id: customerId,
        currency: 'NZD',
        country_code: 'NZ',
        methods: 'card',
        recurringOptions: JSON.stringify({
          card: { next_triggered_by: 'merchant', merchant_trigger_reason: 'unscheduled', requires_cvc: false },
        }),
        successUrl: ok.toString(),
        failUrl: fail.toString(),
        cancelUrl: fail.toString(),
      }).toString()
      return json({ checkoutUrl })
    }

    if (action === 'confirm') {
      if (!existing?.provider_customer_id) return json({ status: 'none' })
      const list = await airwallexRequest<{ items: Consent[] }>(
        'GET', `/api/v1/pa/payment_consents?customer_id=${existing.provider_customer_id}&status=VERIFIED`,
      )
      const consent = (list.items || []).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))[0]
      if (!consent) return json({ status: existing.status })
      let card = consent.payment_method?.card
      if (!card && consent.payment_method?.id) {
        const pm = await airwallexRequest<{ card?: Card }>('GET', `/api/v1/pa/payment_methods/${consent.payment_method.id}`)
        card = pm.card
      }
      const update = {
        provider_consent_id: consent.id,
        card_brand: card?.brand ?? null,
        card_last4: card?.last4 ?? null,
        card_expiry: card?.expiry_month ? `${card.expiry_month}/${String(card.expiry_year).slice(-2)}` : null,
        status: 'active',
      }
      await admin.from('saved_payment_methods').update(update).eq('user_id', user.id)
      return json({ status: 'active', ...update })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    console.error('save-card error', e)
    return json({ error: e instanceof Error ? e.message : 'Card setup failed' }, 502)
  }
})
