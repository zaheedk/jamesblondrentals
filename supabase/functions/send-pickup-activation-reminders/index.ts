// Daily (9am NZ): for confirmed bookings picking up tomorrow, remind customers
// who have not entered their licence/details to prepare for a faster pick-up.
// Sends one email + one text per booking, never repeated (claimed in log first).
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { toE164NZ } from './phone.ts'
import { pickupSms, sendTnzSms, tnzSmsStatus } from './tnz.ts'
import { ACTIVATION_REDIRECT_URL, pickupAccountLink } from './account-link.ts'
import { z } from 'npm:zod@3'

const SITE_URL = 'https://www.jamesblond.co.nz'
const FROM_EMAIL = 'James Blond Rentals <info@jamesblond.co.nz>'
const LOGO_URL = 'https://www.jamesblond.co.nz/lovable-uploads/900107e8-dbcb-44ce-96a9-0588959abf24.png'

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const nzDate = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * 86400000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(d)
}
const dmy = (iso: string) => iso.split('-').reverse().join('/')

function emailHtml(name: string, vehicle: string, date: string, time: string, location: string, url: string, activated = false) {
  const p = (t: string) => `<p style="font-size:15px;color:#334155;line-height:1.6;margin:0 0 14px;">${t}</p>`
  const tick = (t: string) => `<p style="font-size:15px;color:#0d6b3d;margin:4px 0 4px 10px;font-weight:600;">✓ ${t}</p>`
  return `<!DOCTYPE html><html><body style="margin:0;background:#f4f7f6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="background:#002147;padding:24px;text-align:center;"><img src="${LOGO_URL}" width="160" alt="James Blond Rentals"/></td></tr>
<tr><td style="padding:24px 30px 0;">
<h1 style="font-size:22px;color:#002147;margin:0 0 16px;">See you tomorrow${name ? `, ${name}` : ''}!</h1>
${p(`Your <strong>${vehicle}</strong> is booked for pick-up on <strong>${date}${time ? ` at ${time}` : ''}</strong>${location ? ` from <strong>${location}</strong>` : ''}.`)}
${p(`Save time at the counter by ${activated ? 'signing in and adding your details' : 'activating your account'} today. It only takes a couple of minutes to:`)}
${tick('Check your contact and address details')}
${tick('Upload your driver licence')}
${tick('Add any additional drivers')}
</td></tr>
<tr><td style="text-align:center;padding:24px 30px;"><a href="${url}" style="display:inline-block;background:#0d6b3d;color:#fff;font-size:16px;font-weight:bold;border-radius:8px;padding:14px 32px;text-decoration:none;">${activated ? 'Sign in to add my details' : 'Activate my account'}</a></td></tr>
<tr><td style="padding:0 30px 24px;text-align:center;"><p style="font-size:13px;color:#64748b;margin:0;">Questions? Call us on 0800 525 663.</p></td></tr>
<tr><td style="border-top:1px solid #e2e8f0;padding:16px 30px;text-align:center;"><p style="font-size:12px;color:#94a3b8;margin:0;">James Blond Rentals · 0800 525 663 · info@jamesblond.co.nz</p></td></tr>
</table></td></tr></table></body></html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!url || !serviceKey || !anonKey) return json({ error: 'Reminder service not configured' }, 500)
  const admin = createClient(url, serviceKey)

  // Auth: cron vault token, or an admin session
  let ok = false
  const cronToken = req.headers.get('x-cron-token')
  if (cronToken) {
    const { data } = await admin.rpc('verify_quote_reminder_cron_token', { _token: cronToken })
    ok = data === true
  }
  if (!ok) {
    const auth = req.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
    const uc = createClient(url, anonKey, { global: { headers: { Authorization: auth } } })
    const { data: claims } = await uc.auth.getClaims(auth.slice(7))
    const uid = claims?.claims?.sub
    if (!uid) return json({ error: 'Unauthorized' }, 401)
    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: uid, _role: 'admin' })
    if (!isAdmin) return json({ error: 'Forbidden' }, 403)
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  const tnzToken = Deno.env.get('TNZ_AUTH_TOKEN')
  const parsed = z.object({ settings: z.boolean().optional(), dryRun: z.boolean().optional(), testEmail: z.string().email().optional(),
    testPhone: z.string().min(1).max(30).optional(), smsStatusId: z.string().regex(/^[a-zA-Z0-9-]{1,40}$/).optional() })
    .strict().safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return json({ error: 'Invalid reminder request' }, 400)
  const body = parsed.data
  if (body.settings) return json({ smsEnabled: Deno.env.get('PICKUP_SMS_ENABLED') === 'true' })
  const dryRun = body?.dryRun === true
  // Sample mode: send to a test email/phone with fictitious details, no logging
  const testEmail: string | undefined = body?.testEmail
  const testPhone: string | undefined = body?.testPhone
  if (body.smsStatusId) {
    if (!tnzToken) return json({ error: 'TNZ text messaging not configured' }, 503)
    try { return json(await tnzSmsStatus(tnzToken, body.smsStatusId)) }
    catch (e) { return json({ error: String(e) }, 502) }
  }

  async function sendEmail(to: string, subject: string, html: string) {
    if (!resendKey) throw new Error('RESEND_API_KEY missing')
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(`Email failed [${r.status}]: ${JSON.stringify(d)}`)
    return d.id as string
  }
  async function sendSms(to: string, text: string) {
    if (!tnzToken) throw new Error('TNZ text messaging not configured')
    return sendTnzSms(tnzToken, to, text)
  }
  const smsText = pickupSms

  if (testEmail || testPhone) {
    const out: Record<string, unknown> = {}
    const sampleDate = dmy(nzDate(1))
    try {
    if (testEmail) out.email = await sendEmail(testEmail, '[SAMPLE] Your pick-up is tomorrow – activate your account for a faster pick-up',
      emailHtml('Alex', '3 Ton Box Truck', sampleDate, '09:00', 'West Auckland – Kelston', `${SITE_URL}/login`))
    if (testPhone) {
      const to = toE164NZ(testPhone)
      if (!to) return json({ error: 'Invalid NZ mobile' }, 400)
      console.log(`Sending sample pickup text to ${to.slice(0, 5)}***`)
      out.sms = await sendSms(to, `[SAMPLE] ${smsText('Zaheed', '09:00')}`)
    }
    return json({ sample: true, provider: 'TNZ', ...out })
    } catch (e) { console.error('Sample send failed:', String(e)); return json({ error: String(e) }, 502) }
  }

  const tomorrow = nzDate(1)
  const { data: rows, error } = await admin.from('bookings')
    .select('booking_reference, user_id, customer_first_name, customer_email, customer_phone, customer_mobile, vehicle_name, pickup_date, pickup_time, pickup_location_name')
    .eq('booking_status', 'confirmed').eq('pickup_date', tomorrow)
    .not('customer_email', 'is', null).not('booking_reference', 'is', null)
  if (error) return json({ error: error.message }, 500)

  const results = { tomorrow, bookings: rows?.length ?? 0, emailed: 0, texted: 0, skippedActivated: 0, skippedNoAccount: 0, skippedDetailsEntered: 0, alreadySent: 0, errors: [] as any[], details: [] as any[] }
  const seenEmails = new Set<string>()

  for (const b of rows ?? []) {
    const email = String(b.customer_email).toLowerCase().trim()
    if (seenEmails.has(email)) continue
    seenEmails.add(email)
    let userId = b.user_id as string | null
    if (!userId) {
      const { data: p } = await admin.from('profiles').select('id').ilike('email', email).maybeSingle()
      userId = p?.id ?? null
    }
    if (!userId) { results.skippedNoAccount++; continue }
    const { data: u } = await admin.auth.admin.getUserById(userId)
    if (!u?.user) { results.skippedNoAccount++; continue }
    const activated = !!u.user.last_sign_in_at
    // Only text customers who haven't added their licence/details yet
    const { data: docs } = await admin.from('customer_documents').select('id').eq('user_id', userId).limit(1)
    const { data: cust } = await admin.from('customers').select('license_number').eq('user_id', userId).limit(1).maybeSingle()
    const hasDetails = (docs && docs.length > 0) || !!cust?.license_number
    if (hasDetails) { results.skippedDetailsEntered = (results.skippedDetailsEntered ?? 0) + 1; continue }

    const name = b.customer_first_name || ''
    const date = dmy(b.pickup_date)
    const time = (b.pickup_time || '').slice(0, 5)
    const phone = toE164NZ(b.customer_mobile) ?? toE164NZ(b.customer_phone)
    const detail: any = { ref: b.booking_reference, email, phone: !!phone }
    if (dryRun) { results.details.push({ ...detail, dryRun: true }); continue }

    const accountLink = pickupAccountLink(activated, async () => {
      const { data: link, error: linkError } = await admin.auth.admin.generateLink({
        type: 'recovery', email, options: { redirectTo: ACTIVATION_REDIRECT_URL },
      })
      if (linkError) throw new Error('Could not create account activation link; reminder not sent')
      return link?.properties?.action_link
    })

    // Email
    const { data: ce } = await admin.from('pickup_activation_reminder_log')
      .insert({ booking_reference: b.booking_reference, customer_email: email, channel: 'email' }).select('id').maybeSingle()
    if (!ce) results.alreadySent++
    else {
      try {
        const activateUrl = await accountLink()
        const id = await sendEmail(email, `Your pick-up is tomorrow – ${activated ? 'add your details' : 'activate your account'} for a faster pick-up`,
          emailHtml(name, b.vehicle_name || 'vehicle', date, time, b.pickup_location_name || '', activateUrl, activated))
        await admin.from('pickup_activation_reminder_log').update({ provider_id: id }).eq('id', ce.id)
        results.emailed++; detail.email_sent = true
      } catch (e) {
        await admin.from('pickup_activation_reminder_log').delete().eq('id', ce.id)
        results.errors.push({ ...detail, channel: 'email', error: String(e) })
      }
    }
    // Text — the owner controls live sending through PICKUP_SMS_ENABLED.
    if (phone && Deno.env.get('PICKUP_SMS_ENABLED') === 'true') {
      const { data: cs } = await admin.from('pickup_activation_reminder_log')
        .insert({ booking_reference: b.booking_reference, customer_email: email, channel: 'sms' }).select('id').maybeSingle()
      if (cs) {
        try {
          const sid = await sendSms(phone, smsText(name, time, await accountLink()))
          await admin.from('pickup_activation_reminder_log').update({ provider_id: sid }).eq('id', cs.id)
          results.texted++; detail.sms_sent = true
        } catch (e) {
          await admin.from('pickup_activation_reminder_log').delete().eq('id', cs.id)
          results.errors.push({ ...detail, channel: 'sms', error: String(e) })
        }
      }
    }
    results.details.push(detail)
  }
  return json(results)
})
