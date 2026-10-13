// Admin-only: sends follow-up reminders for unconverted quotes.
// Only emails quotes whose vehicle is still available in RCM for the quoted
// dates/location, and includes a "Confirm my booking" link so the customer can
// convert the quote online. One email per customer (latest quote wins).
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'
import { nzToday, reminderDue, type ReminderKind } from './schedule.ts'

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

async function rcmPost(body: Record<string, unknown>) {
  const raw = JSON.stringify(body)
  const res = await fetch(`${RCM_HOST}/booking/v3.2?apikey=${RCM_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', signature: await hmacHex(raw) },
    body: raw,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.status !== 'OK') throw new Error(`RCM ${body.method} failed: ${res.status} ${data?.error ?? ''}`)
  return data
}

let cachedAgeId: string | number | null = null
async function defaultAgeId() {
  if (cachedAgeId != null) return cachedAgeId
  const s1 = await rcmPost({ method: 'step1' })
  const ages = s1?.results?.driverages ?? []
  const def = ages.find((a: any) => a.isdefault) ?? ages[ages.length - 1]
  if (!def?.id) throw new Error('RCM returned no driver age options')
  cachedAgeId = def.id
  return def.id
}

// A quote is sendable when RCM step2 still shows an available car in the
// quoted category for the quoted dates and location (available 1 or 2, the
// same rule the website search uses).
async function quoteStillAvailable(q: QuoteRow): Promise<boolean> {
  if (!q.vehicle_category || !q.pickup_location_id) return false
  const s2 = await rcmPost({
    method: 'step2',
    pickuplocationid: q.pickup_location_id,
    dropofflocationid: q.dropoff_location_id || q.pickup_location_id,
    pickupdate: isoToDmy(q.pickup_date),
    pickuptime: q.pickup_time?.slice(0, 5) || '10:00',
    dropoffdate: isoToDmy(q.dropoff_date),
    dropofftime: q.dropoff_time?.slice(0, 5) || '10:00',
    ageid: await defaultAgeId(),
    vehiclecategorytypeid: q.vehicle_category,
  })
  const cars = s2?.results?.availablecars ?? []
  return cars.some((c: any) => c?.available === 1 || c?.available === 2)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Admin-only: either an admin user's session, or the batch token (used by
  // scheduled/operator-triggered runs).
  const url = Deno.env.get('SUPABASE_URL')!
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const batchToken = Deno.env.get('QUOTE_REMINDER_TOKEN')
  const providedToken = req.headers.get('x-quote-reminder-token')
  let tokenOk = !!(batchToken && providedToken && batchToken === providedToken)
  const cronToken = req.headers.get('x-cron-token')
  if (!tokenOk && cronToken) {
    const { data: ok } = await admin.rpc('verify_quote_reminder_cron_token', { _token: cronToken })
    tokenOk = ok === true
  }
  if (!tokenOk) {
    const auth = req.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
    const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
    const { data: claims } = await userClient.auth.getClaims(auth.slice(7))
    const uid = claims?.claims?.sub
    if (!uid) return json({ error: 'Unauthorized' }, 401)
    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: uid, _role: 'admin' })
    if (!isAdmin) return json({ error: 'Forbidden' }, 403)
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) return json({ error: 'Email service not configured' }, 500)
  if (!RCM_KEY || !RCM_SECRET) return json({ error: 'RCM is not configured' }, 500)

  const body = await req.json().catch(() => ({}))
  const dryRun = body?.dryRun === true
  const limit = Math.min(Math.max(Number(body?.limit) || 100, 1), 200)
  const offset = Math.max(Number(body?.offset) || 0, 0)

  // Pending quotes, more than 2 days old, future pickup
  const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  const today = nzToday()
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
  const allQuotes = [...byEmail.values()]
  const quotes = allQuotes.slice(offset, offset + limit)

  // Reminders already sent for these quotes (never resend the same kind)
  const refs = quotes.map((q) => q.booking_reference)
  const { data: logs } = refs.length
    ? await admin.from('quote_reminder_log').select('booking_reference, kind').in('booking_reference', refs)
    : { data: [] as any[] }
  const sentKinds = new Map<string, Set<ReminderKind>>()
  for (const l of logs ?? []) {
    if (!sentKinds.has(l.booking_reference)) sentKinds.set(l.booking_reference, new Set())
    sentKinds.get(l.booking_reference)!.add(l.kind as ReminderKind)
  }

  const sent: any[] = []
  const skippedUnavailable: any[] = []
  const skippedNotDue: any[] = []
  const errors: any[] = []

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  let first = true
  for (const q of quotes) {
    const label = { email: q.customer_email, ref: q.booking_reference, vehicle: q.vehicle_name, pickup: q.pickup_date }
    const kind = reminderDue(today, q.pickup_date, sentKinds.get(q.booking_reference) ?? new Set())
    if (!kind) { skippedNotDue.push(label); continue }
    const template = TEMPLATES[kind === 'final' ? 'quote-final-reminder' : 'quote-reminder']
    try {
      // Pace RCM calls — bursts trip its 429 rate limit
      if (!first) await sleep(300)
      first = false
      if (!(await quoteStillAvailable(q))) {
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
        sent.push({ ...label, kind, dryRun: true, completeUrl })
        continue
      }
      // Claim the send first so overlapping runs can never double-send
      const email = q.customer_email!.toLowerCase().trim()
      const claim = [{ booking_reference: q.booking_reference, customer_email: email, kind }]
      if (kind === 'final' && !sentKinds.get(q.booking_reference)?.has('first')) {
        claim.push({ booking_reference: q.booking_reference, customer_email: email, kind: 'first' })
      }
      const { error: claimErr } = await admin.from('quote_reminder_log').insert(claim)
      if (claimErr) { skippedNotDue.push({ ...label, reason: 'already claimed' }); continue }

      const html = await renderAsync(React.createElement(template.component, templateData))
      const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({ from: FROM_EMAIL, to: [q.customer_email], subject, html }),
      })
      const resendData = await resendRes.json().catch(() => ({}))
      if (!resendRes.ok) {
        await admin.from('quote_reminder_log').delete().eq('booking_reference', q.booking_reference).in('kind', claim.map((c) => c.kind))
        errors.push({ ...label, error: JSON.stringify(resendData) })
        continue
      }
      await admin.from('quote_reminder_log').update({ email_id: resendData.id }).eq('booking_reference', q.booking_reference).eq('kind', kind)
      sent.push({ ...label, kind, emailId: resendData.id })
    } catch (e) {
      errors.push({ ...label, error: String(e) })
    }
  }

  return json({
    dryRun,
    offset,
    quotesFound: quotes.length,
    totalQuotes: allQuotes.length,
    sent: sent.length,
    skippedUnavailable: skippedUnavailable.length,
    skippedNotDue: skippedNotDue.length,
    errors: errors.length,
    details: { sent, skippedUnavailable, errors },
  })
})
