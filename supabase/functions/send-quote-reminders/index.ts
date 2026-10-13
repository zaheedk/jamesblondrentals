// Admin-only: sends follow-up reminders for unconverted quotes.
// Only emails quotes whose vehicle is still available in RCM for the quoted
// dates/location, and includes a "Confirm my booking" link so the customer can
// convert the quote online. One email per customer (latest quote wins).
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const FROM_EMAIL = 'James Blond Rentals <info@jamesblond.co.nz>'
const SITE_URL = 'https://www.jamesblond.co.nz'
const RCM_HOST = 'https://apis.rentalcarmanager.com'
const RCM_KEY = Deno.env.get('RCM_API_KEY')
const RCM_SECRET = Deno.env.get('RCM_API_SECRET')

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

async function hmacHex(msg: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(RCM_SECRET!), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

const isoToDmy = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso
}

const isCommercialVehicle = (name: string) =>
  /truck|box|cargo|van|ute|tail\s*lift|ton\b/i.test(name) && !/minibus|seat/i.test(name)

type QuoteRow = {
  id: string
  booking_reference: string
  reservation_reference: string | null
  customer_first_name: string | null
  customer_last_name: string | null
  customer_email: string | null
  vehicle_name: string | null
  vehicle_category: string | null
  pickup_location_id: string | null
  dropoff_location_id: string | null
  pickup_date: string
  dropoff_date: string
  pickup_time: string
  dropoff_time: string
  total_amount: number | null
  created_at: string
}

async function rcmAvailableVehicles(q: QuoteRow): Promise<any[]> {
  const body = JSON.stringify({
    method: 'vehicles/available',
    pickupLocationId: q.pickup_location_id,
    dropoffLocationId: q.dropoff_location_id || q.pickup_location_id,
    pickupDate: q.pickup_date,
    dropoffDate: q.dropoff_date,
    pickupTime: q.pickup_time?.slice(0, 5) || '10:00',
    dropoffTime: q.dropoff_time?.slice(0, 5) || '10:00',
  })
  const res = await fetch(`${RCM_HOST}/booking/v3.2?apikey=${RCM_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', signature: await hmacHex(body) },
    body,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.status !== 'OK') throw new Error(`RCM availability failed: ${res.status}`)
  const results = data?.results
  return Array.isArray(results) ? results : (results?.vehicles ?? [])
}

// A quote is sendable when RCM still offers a vehicle in the quoted category
// (or with the quoted name) for the quoted dates and location.
function quoteStillAvailable(q: QuoteRow, vehicles: any[]): boolean {
  const wantedName = (q.vehicle_name || '').toLowerCase().replace(/\s+/g, ' ').trim()
  const wantedCat = String(q.vehicle_category || '')
  return vehicles.some((v) => {
    if (v?.available === false) return false
    const vName = String(v?.name ?? v?.vehicledescription1 ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
    const vCat = String(v?.vehiclecategorytypeid ?? v?.categoryid ?? v?.category ?? '')
    if (wantedCat && vCat && vCat === wantedCat) return true
    if (wantedName && vName && (vName.includes(wantedName) || wantedName.includes(vName))) return true
    return false
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Admin-only
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
  const url = Deno.env.get('SUPABASE_URL')!
  const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
  const { data: claims } = await userClient.auth.getClaims(auth.slice(7))
  const uid = claims?.claims?.sub
  if (!uid) return json({ error: 'Unauthorized' }, 401)
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: isAdmin } = await admin.rpc('has_role', { _user_id: uid, _role: 'admin' })
  if (!isAdmin) return json({ error: 'Forbidden' }, 403)

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) return json({ error: 'Email service not configured' }, 500)
  if (!RCM_KEY || !RCM_SECRET) return json({ error: 'RCM is not configured' }, 500)

  const body = await req.json().catch(() => ({}))
  const dryRun = body?.dryRun === true
  const limit = Math.min(Math.max(Number(body?.limit) || 100, 1), 200)

  // Pending quotes, more than 2 days old, future pickup
  const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  const today = new Date().toISOString().slice(0, 10)
  const { data: rows, error } = await admin
    .from('bookings')
    .select('id, booking_reference, reservation_reference, customer_first_name, customer_last_name, customer_email, vehicle_name, vehicle_category, pickup_location_id, dropoff_location_id, pickup_date, dropoff_date, pickup_time, dropoff_time, total_amount, created_at')
    .eq('booking_status', 'pending')
    .eq('payment_status', 'pending')
    .gte('pickup_date', today)
    .lte('created_at', cutoff)
    .not('customer_email', 'is', null)
    .not('reservation_reference', 'is', null)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) return json({ error: error.message }, 500)

  // One email per customer — latest quote wins
  const byEmail = new Map<string, QuoteRow>()
  for (const row of (rows ?? []) as QuoteRow[]) {
    const email = row.customer_email!.toLowerCase().trim()
    if (!byEmail.has(email)) byEmail.set(email, row)
  }
  const quotes = [...byEmail.values()].slice(0, limit)

  const template = TEMPLATES['quote-reminder']
  const sent: any[] = []
  const skippedUnavailable: any[] = []
  const errors: any[] = []

  for (const q of quotes) {
    const label = { email: q.customer_email, ref: q.booking_reference, vehicle: q.vehicle_name, pickup: q.pickup_date }
    try {
      const vehicles = await rcmAvailableVehicles(q)
      if (!quoteStillAvailable(q, vehicles)) {
        skippedUnavailable.push(label)
        continue
      }
      const completeUrl = `${SITE_URL}/complete-booking/${encodeURIComponent(q.reservation_reference!)}`
      const templateData = {
        customerName: q.customer_first_name || '',
        vehicleName: q.vehicle_name || 'your vehicle',
        pickupDate: isoToDmy(q.pickup_date),
        dropoffDate: isoToDmy(q.dropoff_date),
        totalCost: q.total_amount != null ? `$${Number(q.total_amount).toFixed(2)}` : '',
        reservationRef: q.reservation_reference,
        completeUrl,
        vehicleType: isCommercialVehicle(q.vehicle_name || '') ? 'commercial' : 'passenger',
      }
      if (dryRun) {
        sent.push({ ...label, dryRun: true, completeUrl })
        continue
      }
      const html = await renderAsync(React.createElement(template.component, templateData))
      const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({ from: FROM_EMAIL, to: [q.customer_email], subject, html }),
      })
      const resendData = await resendRes.json().catch(() => ({}))
      if (!resendRes.ok) {
        errors.push({ ...label, error: JSON.stringify(resendData) })
        continue
      }
      sent.push({ ...label, emailId: resendData.id })
    } catch (e) {
      errors.push({ ...label, error: String(e) })
    }
  }

  return json({
    dryRun,
    quotesFound: quotes.length,
    sent: sent.length,
    skippedUnavailable: skippedUnavailable.length,
    errors: errors.length,
    details: { sent, skippedUnavailable, errors },
  })
})
