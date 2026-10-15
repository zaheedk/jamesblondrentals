// Daily (9am NZ): for confirmed bookings picking up tomorrow, remind customers
// who have never signed in to their account to activate it for a faster pick-up.
// Sends one email + one text per booking, never repeated (claimed in log first).
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { toE164NZ } from './phone.ts'

const SITE_URL = 'https://www.jamesblond.co.nz'
const FROM_EMAIL = 'James Blond Rentals <info@jamesblond.co.nz>'
const SMS_FROM = '+14787072381'
const LOGO_URL = 'https://www.jamesblond.co.nz/lovable-uploads/900107e8-dbcb-44ce-96a9-0588959abf24.png'
const GATEWAY = 'https://connector-gateway.lovable.dev/twilio'

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const nzDate = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * 86400000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(d)
}
const dmy = (iso: string) => iso.split('-').reverse().join('/')

function emailHtml(name: string, vehicle: string, date: string, time: string, location: string, url: string) {
  const p = (t: string) => `<p style="font-size:15px;color:#334155;line-height:1.6;margin:0 0 14px;">${t}</p>`
  const tick = (t: string) => `<p style="font-size:15px;color:#0d6b3d;margin:4px 0 4px 10px;font-weight:600;">✓ ${t}</p>`
  return `<!DOCTYPE html><html><body style="margin:0;background:#f4f7f6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="background:#002147;padding:24px;text-align:center;"><img src="${LOGO_URL}" width="160" alt="James Blond Rentals"/></td></tr>
<tr><td style="padding:24px 30px 0;">
<h1 style="font-size:22px;color:#002147;margin:0 0 16px;">See you tomorrow${name ? `, ${name}` : ''}!</h1>
${p(`Your <strong>${vehicle}</strong> is booked for pick-up on <strong>${date}${time ? ` at ${time}` : ''}</strong>${location ? ` from <strong>${location}</strong>` : ''}.`)}
${p('Save time at the counter by activating your account today. It only takes a couple of minutes to:')}
${tick('Check your contact and address details')}
${tick('Upload your driver licence')}
${tick('Add any additional drivers')}
</td></tr>
<tr><td style="text-align:center;padding:24px 30px;"><a href="${url}" style="display:inline-block;background:#0d6b3d;color:#fff;font-size:16px;font-weight:bold;border-radius:8px;padding:14px 32px;text-decoration:none;">Activate my account</a></td></tr>
<tr><td style="padding:0 30px 24px;text-align:center;"><p style="font-size:13px;color:#64748b;margin:0;">Questions? Call us on 0800 525 663.</p></td></tr>
<tr><td style="border-top:1px solid #e2e8f0;padding:16px 30px;text-align:center;"><p style="font-size:12px;color:#94a3b8;margin:0;">James Blond Rentals · 0800 525 663 · info@jamesblond.co.nz</p></td></tr>
</table></td></tr></table></body></html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const url = Deno.env.get('SUPABASE_URL')!
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

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
    const uc = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
    const { data: claims } = await uc.auth.getClaims(auth.slice(7))
    const uid = claims?.claims?.sub
    if (!uid) return json({ error: 'Unauthorized' }, 401)
    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: uid, _role: 'admin' })
    if (!isAdmin) return json({ error: 'Forbidden' }, 403)
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  const lovableKey = Deno.env.get('LOVABLE_API_KEY')
  const twilioKey = Deno.env.get('TWILIO_API_KEY')
  const body = await req.json().catch(() => ({}))
  const dryRun = body?.dryRun === true
  // Sample mode: send to a test email/phone with fictitious details, no logging
  const testEmail: string | undefined = body?.testEmail
  const testPhone: string | undefined = body?.testPhone

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
    if (!lovableKey || !twilioKey) throw new Error('Text messaging not configured')
    const r = await fetch(`${GATEWAY}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': twilioKey, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: to, From: SMS_FROM, Body: text }),
    })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(`Text failed [${r.status}]: ${JSON.stringify(d)}`)
    return d.sid as string
  }
  const smsText = (name: string, date: string, time: string) =>
    `Hi ${name || 'there'}, your James Blond Rentals pick-up is tomorrow (${date}${time ? ` ${time}` : ''}). Activate your account to add your licence & details for a faster pick-up: ${SITE_URL}/login?activate=1 (check your email for the link). Reply or call 0800 525 663.`

  if (testEmail || testPhone) {
    const out: Record<string, unknown> = {}
    if (testEmail) out.email = await sendEmail(testEmail, '[SAMPLE] Your pick-up is tomorrow – activate your account for a faster pick-up',
      emailHtml('Alex', '3 Ton Box Truck', '16/10/2026', '09:00', 'West Auckland – Kelston', `${SITE_URL}/login`))
    if (testPhone) {
      const to = toE164NZ(testPhone)
      if (!to) return json({ error: 'Invalid NZ mobile' }, 400)
      out.sms = await sendSms(to, smsText('Alex', '16/10/2026', '09:00'))
    }
    return json({ sample: true, ...out })
  }

  const tomorrow = nzDate(1)
  const { data: rows, error } = await admin.from('bookings')
    .select('booking_reference, user_id, customer_first_name, customer_email, customer_phone, customer_mobile, vehicle_name, pickup_date, pickup_time, pickup_location_name')
    .eq('booking_status', 'confirmed').eq('pickup_date', tomorrow)
    .not('customer_email', 'is', null).not('booking_reference', 'is', null)
  if (error) return json({ error: error.message }, 500)

  const results = { tomorrow, bookings: rows?.length ?? 0, emailed: 0, texted: 0, skippedActivated: 0, skippedNoAccount: 0, alreadySent: 0, errors: [] as any[], details: [] as any[] }
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
    if (u.user.last_sign_in_at) { results.skippedActivated++; continue }

    const name = b.customer_first_name || ''
    const date = dmy(b.pickup_date)
    const time = (b.pickup_time || '').slice(0, 5)
    const phone = toE164NZ(b.customer_mobile) ?? toE164NZ(b.customer_phone)
    const detail: any = { ref: b.booking_reference, email, phone: !!phone }
    if (dryRun) { results.details.push({ ...detail, dryRun: true }); continue }

    // Email
    const { data: ce } = await admin.from('pickup_activation_reminder_log')
      .insert({ booking_reference: b.booking_reference, customer_email: email, channel: 'email' }).select('id').maybeSingle()
    if (!ce) results.alreadySent++
    else {
      try {
        const { data: link } = await admin.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: `${SITE_URL}/reset-password` } })
        const activateUrl = link?.properties?.action_link || `${SITE_URL}/login`
        const id = await sendEmail(email, 'Your pick-up is tomorrow – activate your account for a faster pick-up',
          emailHtml(name, b.vehicle_name || 'vehicle', date, time, b.pickup_location_name || '', activateUrl))
        await admin.from('pickup_activation_reminder_log').update({ provider_id: id }).eq('id', ce.id)
        results.emailed++; detail.email_sent = true
      } catch (e) {
        await admin.from('pickup_activation_reminder_log').delete().eq('id', ce.id)
        results.errors.push({ ...detail, channel: 'email', error: String(e) })
      }
    }
    // Text
    if (phone) {
      const { data: cs } = await admin.from('pickup_activation_reminder_log')
        .insert({ booking_reference: b.booking_reference, customer_email: email, channel: 'sms' }).select('id').maybeSingle()
      if (cs) {
        try {
          const sid = await sendSms(phone, smsText(name, date, time))
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
