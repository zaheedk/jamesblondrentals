// Public tracking endpoint for quote reminder emails.
// GET ?id=<quote_reminder_log id>&e=open  -> records an open, returns a 1x1 gif
// GET ?id=<quote_reminder_log id>&e=click&to=<reservationRef> -> records a click, redirects to the confirm page
import { createClient } from 'npm:@supabase/supabase-js@2'

const SITE_URL = 'https://www.jamesblond.co.nz'
const GIF = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), (c) => c.charCodeAt(0))
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const REF = /^[A-Za-z0-9_-]{1,64}$/

Deno.serve(async (req) => {
  const u = new URL(req.url)
  const id = u.searchParams.get('id') ?? ''
  const event = u.searchParams.get('e') === 'click' ? 'click' : 'open'
  const to = u.searchParams.get('to') ?? ''

  if (UUID.test(id)) {
    try {
      const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
      await admin.rpc('track_quote_reminder', { _id: id, _event: event })
    } catch (e) {
      console.error('track failed', e)
    }
  }

  if (event === 'click') {
    // s=<search query> sends the customer straight into step 3 of the booking
    // flow via /book-alternative (alternatives email); that page re-checks
    // availability and falls back to the pre-filtered search if needed
    const search = u.searchParams.get('s')
    let dest = REF.test(to) ? `${SITE_URL}/complete-booking/${encodeURIComponent(to)}` : SITE_URL
    if (search) {
      const allowed = ['pickupLocation', 'dropoffLocation', 'pickupDate', 'dropoffDate', 'pickupTime', 'dropoffTime', 'age', 'carCategory']
      const src = new URLSearchParams(search)
      const qs = new URLSearchParams()
      for (const k of allowed) { const v = src.get(k); if (v && v.length <= 32) qs.set(k, v) }
      dest = `${SITE_URL}/book-alternative?${qs.toString()}`
    }
    return new Response(null, { status: 302, headers: { Location: dest, 'Cache-Control': 'no-store' } })
  }
  return new Response(GIF, { headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store, max-age=0' } })
})
