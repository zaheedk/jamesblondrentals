// Saves a customer's card on their open RCM bookings via RCM's own Windcave
// integration: a $0 "Validate" transaction creates a rebilling token, which is
// recorded on the booking with confirmpayment so staff can charge it inside RCM.
//   action "start"   -> returns the Windcave secure page URL
//   action "confirm" -> checks the result and attaches the token to open bookings
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const RCM_KEY = Deno.env.get('RCM_API_KEY') || 'TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq'
const RCM_SECRET = Deno.env.get('RCM_API_SECRET') || 'tsdavpoP51o6AcLIdorqgtFJ0ullAimg'
const CLOSED = ['returned', 'cancelled', 'canceled', 'completed', 'closed', 'no show']

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '')

async function rcm(body: Record<string, unknown>) {
  const s = JSON.stringify(body)
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(RCM_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(s))))
    .map((b) => b.toString(16).padStart(2, '0')).join('')
  const res = await fetch(`https://apis.rentalcarmanager.com/booking/v3.2?apikey=${RCM_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', signature: sig }, body: s,
  })
  const data = await res.json().catch(() => null)
  if (!data || data.status !== 'OK') throw new Error(data?.error || `RCM error ${res.status}`)
  return data.results
}

function ddmmyyyy() {
  const d = new Date(Date.now() + 13 * 3600_000)
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  const { data: { user } } = await admin.auth.getUser(token)
  if (!user) return json({ error: 'Please sign in again and retry' }, 401)

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const action = str(body.action, 16)

  // Open bookings for this customer, earliest pick-up first.
  const today = new Date(Date.now() + 13 * 3600_000).toISOString().slice(0, 10)
  const { data: rows } = await admin.from('bookings')
    .select('reservation_reference, pickup_date')
    .or(`user_id.eq.${user.id},customer_email.ilike.${user.email}`)
    .not('reservation_reference', 'is', null)
    .gte('dropoff_date', today)
    .order('pickup_date')
  const candidates = [...new Set((rows || []).map((r) => r.reservation_reference as string))]
  const openRefs: string[] = []
  for (const ref of candidates) {
    try {
      const info = await rcm({ method: 'bookinginfo', reservationref: ref })
      const b = Array.isArray(info) ? info[0] : info
      const st = String(b?.bookinginfo?.[0]?.reservationstatus ?? b?.reservationstatus ?? '').toLowerCase()
      if (!CLOSED.includes(st)) openRefs.push(ref)
    } catch { openRefs.push(ref) }
  }

  try {
    if (action === 'start') {
      if (!openRefs.length) return json({ error: 'You need an upcoming booking before you can save a card.' }, 400)
      let returnUrl: URL
      try { returnUrl = new URL(str(body.returnUrl, 500)) } catch { return json({ error: 'Invalid returnUrl' }, 400) }
      const okHost = ['jamesblond.co.nz', 'www.jamesblond.co.nz', 'localhost'].includes(returnUrl.hostname) ||
        returnUrl.hostname.endsWith('.lovable.app') || returnUrl.hostname.endsWith('.lovableproject.com')
      if (!okHost) return json({ error: 'returnUrl host is not allowed' }, 400)
      returnUrl.searchParams.set('card_ref', openRefs[0])
      const r = await rcm({
        method: 'createdpspayment', reservationref: openRefs[0], amount: 0,
        transactiontype: 'Validate', returnurl: returnUrl.toString(),
      })
      if (!r?.RedirectUrl) throw new Error('RCM did not return a Windcave link')
      return json({ checkoutUrl: r.RedirectUrl })
    }

    if (action === 'confirm') {
      const ref = str(body.ref, 50)
      const result = str(body.result, 2000)
      if (!ref || !result || !openRefs.includes(ref)) return json({ error: 'Invalid card result' }, 400)
      const r = await rcm({ method: 'getdpspayment', reservationref: ref, result })
      console.log('save-card result', ref, r?.Status, r?.ResponseText)
      if (r?.Status !== 'Approved' || !r?.RebillingToken) {
        return json({ status: 'failed', message: r?.ResponseText || 'Card was not accepted' })
      }
      const attached: string[] = []
      const failed: string[] = []
      for (const b of openRefs) {
        try {
          await rcm({
            method: 'confirmpayment', reservationref: b, amount: 0, success: true, paytype: 'Windcave',
            paydate: ddmmyyyy(), supplierid: 2, transactid: r.RebillingToken, dpstxnref: r.TransactionId || '',
            paysource: 'Card saved in customer portal', transtype: 'Auth',
          })
          attached.push(b)
        } catch (e) { console.error('attach failed', b, e); failed.push(b) }
      }
      const num = String(r.CardNumber || r.CardNumber2 || '')
      const update = {
        user_id: user.id, provider: 'windcave', provider_customer_id: ref,
        provider_consent_id: r.RebillingToken,
        card_brand: r.CardName || r.CardType || null,
        card_last4: num ? num.slice(-2) : null,
        card_expiry: r.DateExpiry ? `${String(r.DateExpiry).slice(0, 2)}/${String(r.DateExpiry).slice(2)}` : null,
        status: attached.length ? 'active' : 'pending',
      }
      await admin.from('saved_payment_methods').upsert(update, { onConflict: 'user_id' })
      return json({ status: update.status, attached, failed })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    console.error('rcm-save-card error', e)
    return json({ error: e instanceof Error ? e.message : 'Card setup failed' }, 502)
  }
})
