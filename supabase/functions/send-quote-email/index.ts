import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const FROM_EMAIL = 'James Blond Rentals <info@jamesblond.co.nz>'
const TEMPLATE_NAME = 'quote-follow-up'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const str = (v: unknown, max = 200) =>
  typeof v === 'string' ? v.slice(0, max) : ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured')
    return json({ error: 'Email service not configured' }, 500)
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON in request body' }, 400)
  }

  const recipientEmail = str(body.recipientEmail, 320).trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return json({ error: 'A valid recipientEmail is required' }, 400)
  }

  const reservationRef = str(body.reservationRef, 64).trim()
  if (!reservationRef) {
    return json({ error: 'reservationRef is required' }, 400)
  }

  const siteUrl = 'https://www.jamesblond.co.nz'
  const templateData = {
    customerName: str(body.customerName, 120),
    reservationRef,
    reservationNo: str(body.reservationNo, 64),
    vehicleName: str(body.vehicleName, 160),
    pickupDate: str(body.pickupDate, 40),
    pickupTime: str(body.pickupTime, 20),
    dropoffDate: str(body.dropoffDate, 40),
    dropoffTime: str(body.dropoffTime, 20),
    pickupLocation: str(body.pickupLocation, 160),
    dropoffLocation: str(body.dropoffLocation, 160),
    totalCost: str(body.totalCost, 40),
    completeUrl: `${siteUrl}/complete-booking/${encodeURIComponent(reservationRef)}`,
  }

  const template = TEMPLATES[TEMPLATE_NAME]
  const html = await renderAsync(React.createElement(template.component, templateData))
  const subject =
    typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [recipientEmail],
      bcc: ['info@jamesblond.co.nz'],
      subject,
      html,
    }),
  })

  const resendData = await resendRes.json()
  if (!resendRes.ok) {
    console.error('Resend API error:', resendData)
    return json({ error: 'Failed to send email', details: resendData }, 500)
  }

  console.log('Quote follow-up email sent', { reservationRef, emailId: resendData.id })
  return json({ success: true, emailId: resendData.id })
})