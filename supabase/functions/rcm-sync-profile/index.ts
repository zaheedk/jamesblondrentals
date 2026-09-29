import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';

// Pushes a customer's portal profile and additional drivers onto their open
// bookings in RCM (editbooking / extradriver, API v3.1, URL-signed HMAC).

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RCM_KEY = Deno.env.get('RCM_API_KEY');
const RCM_SECRET = Deno.env.get('RCM_API_SECRET');
const RCM_HOST = 'https://apis.rentalcarmanager.com';
const CLOSED = ['returned', 'cancelled', 'canceled', 'completed', 'closed', 'no show'];
const COUNTRY_IDS: Record<string, number> = { 'new zealand': 2, nz: 2 };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

async function hmacHex(msg: string) {
  if (!RCM_SECRET) throw new Error('RCM is not configured');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(RCM_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// RCM only accepts A-Z a-z 0-9 . - # @ / and spaces; commas separate fields.
const clean = (v: unknown) => String(v ?? '').replace(/[^A-Za-z0-9.\-#@/ \u0080-\u0250]/g, ' ').replace(/\s+/g, ' ').trim();
const dmy = (iso?: string | null) => {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
};
const rcmDate = (v?: string) => {
  // "17/Feb/1978" -> "17/02/1978"; "lifetime" -> 01/01/3000
  if (!v) return '';
  if (/lifetime/i.test(v)) return '01/01/3000';
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const m = /^(\d{1,2})\/([A-Za-z]{3})\/(\d{4})$/.exec(v);
  if (m) return `${m[1].padStart(2, '0')}/${String(months.indexOf(m[2].toLowerCase()) + 1).padStart(2, '0')}/${m[3]}`;
  return v;
};
const b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));

async function bookingInfo(reservationref: string) {
  if (!RCM_KEY) throw new Error('RCM is not configured');
  const body = JSON.stringify({ method: 'bookinginfo', reservationref });
  const res = await fetch(`${RCM_HOST}/booking/v3.2?apikey=${RCM_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', signature: await hmacHex(body) },
    body,
  });
  const data = await res.json().catch(() => null);
  return data?.results ?? null;
}

async function rcmGet(path: string) {
  const res = await fetch(RCM_HOST + path, { headers: { signature: await hmacHex(path) } });
  const text = await res.text();
  const errMatch = /rcmErrors\s*=\s*\[(.*?)\]/s.exec(text);
  const errors = errMatch?.[1]?.trim();
  if (!res.ok || (errors && errors.length > 0)) throw new Error(errors || `RCM error ${res.status}`);
  return text;
}

type Person = {
  first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null; mobile?: string | null;
  dob?: string | null; license_number?: string | null; license_country?: string | null; license_expiry?: string | null;
  address?: string | null; suburb?: string | null; city?: string | null; postcode?: string | null; country?: string | null;
};

const BodySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('profile') }),
  z.object({
    action: z.literal('drivers'),
    bookingId: z.string().uuid(),
    reservationReference: z.string().min(1).max(100),
    driverId: z.string().uuid(),
    removed: z.object({ first_name: z.string().max(100), last_name: z.string().max(100) }).optional(),
  }),
]);

function customerData(p: Person, existing: any, keepEmail: boolean) {
  const country = (p.country || '').trim().toLowerCase();
  const cnt = COUNTRY_IDS[country] ?? existing?.countryid ?? 0;
  const addr = [p.address, p.suburb].filter(Boolean).join(' ');
  const fields: [string, string][] = [
    ['fnm', clean(p.first_name || existing?.firstname)],
    ['lnm', clean(p.last_name || existing?.lastname)],
    ['eml', clean(keepEmail ? existing?.email || p.email : p.email || existing?.email)],
    ['phn', clean(p.phone ?? existing?.phone)],
    ['mob', clean(p.mobile ?? existing?.mobile)],
    ['dob', dmy(p.dob) || rcmDate(existing?.dateofbirth)],
    ['lcn', clean(p.license_number || existing?.licenseno)],
    ['lci', clean(p.license_country || existing?.licenseissued)],
    ['lce', dmy(p.license_expiry) || rcmDate(existing?.licenseexpires || existing?.licenceexpires)],
    ['adr', clean(addr || existing?.address)],
    ['cty', clean(p.city || existing?.city)],
    ['sta', clean(existing?.state)],
    ['pcd', clean(p.postcode || existing?.postcode)],
    ['cnt', String(cnt || '')],
    ['fax', ''],
  ];
  // RCM rejects blank dates (SqlDateTime overflow) — leave them out when unknown.
  return fields.filter(([k, v]) => !((k === 'dob' || k === 'lce') && !v)).map(([k, v]) => `${k}:${v}`).join(',');
}

function extraDriverData(p: Person, existing: any) {
  const values = new Map(
    customerData(p, existing, false)
      .split(',')
      .map((field) => {
        const separator = field.indexOf(':');
        return [field.slice(0, separator), field.slice(separator + 1)] as const;
      }),
  );

  // RCM's extradriver parser requires both date columns to exist. Valid
  // sentinel dates keep optional portal fields from causing SQL date errors.
  if (!values.get('dob')) values.set('dob', '01/01/1900');
  if (!values.get('lce')) values.set('lce', '01/01/3000');

  const order = ['fnm', 'lnm', 'eml', 'phn', 'mob', 'dob', 'lcn', 'lci', 'lce', 'adr', 'cty', 'sta', 'pcd', 'cnt', 'fax'];
  return order.map((key) => `${key}:${values.get(key) || ''}`).join(',');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const url = Deno.env.get('SUPABASE_URL')!;
    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: userData, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !userData.user) return json({ error: 'Not signed in' }, 401);
    const user = userData.user;

    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: 'Invalid request' }, 400);
    const body = parsed.data;
    const action = body.action;
    const removed = action === 'drivers' && body.removed
      ? { first: clean(body.removed.first_name).toLowerCase(), last: clean(body.removed.last_name).toLowerCase() }
      : null;

    // Open bookings belonging to this customer
    const today = new Date(Date.now() + 13 * 3600e3).toISOString().slice(0, 10);
    const email = (user.email || '').toLowerCase();
    const { data: bookings, error: bErr } = await admin
      .from('bookings')
      .select('id, reservation_reference, dropoff_date')
      .or(`user_id.eq.${user.id},customer_email.ilike.${email}`)
      .not('reservation_reference', 'is', null)
      .gte('dropoff_date', today);
    if (bErr) throw bErr;
    let refs = [...new Set((bookings || []).map((b) => b.reservation_reference as string).filter(Boolean))];
    if (action === 'drivers') {
      const ownedBooking = (bookings || []).find((booking) => booking.id === body.bookingId && booking.reservation_reference === body.reservationReference);
      if (!ownedBooking) return json({ error: 'Booking not found' }, 403);
      refs = [body.reservationReference];
    }

    let profile: Person | null = null;
    let drivers: Person[] = [];
    if (action === 'profile') {
      const { data } = await admin.from('customers').select('*').eq('user_id', user.id).maybeSingle();
      profile = data;
      if (!profile) return json({ synced: [], skipped: [], failed: [], message: 'No saved profile' });
    } else {
      const { data: driver } = await admin.from('additional_drivers').select('*')
        .eq('id', body.driverId).eq('user_id', user.id).maybeSingle();
      if (!driver) return json({ error: 'Driver not found' }, 403);
      if (!removed) {
        const { data: assignment } = await admin.from('booking_additional_drivers').select('id')
          .eq('booking_id', body.bookingId).eq('driver_id', body.driverId).eq('user_id', user.id).maybeSingle();
        if (!assignment) return json({ error: 'Driver is not assigned to this booking' }, 403);
      }
      drivers = [driver];
    }

    const synced: string[] = [], skipped: string[] = [], failed: { booking: string; error: string }[] = [];

    for (const ref of refs) {
      const info = await bookingInfo(ref);
      const b = info?.bookinginfo?.[0];
      const label = b?.reservationno ? String(b.reservationno) : ref;
      if (!b) { failed.push({ booking: label, error: 'Booking not found in RCM' }); continue; }
      if (b.isclosed || CLOSED.includes(String(b.reservationstatus || '').toLowerCase())) { skipped.push(label); continue; }

      try {
        if (action === 'profile') {
          const existing = info.customerinfo?.[0];
          const fees = info.extrafees || [];
          const ins = fees.find((f: any) => f.isinsurancefee)?.extrafeeid ?? 0;
          const opt = fees.filter((f: any) => f.isoptionalfee && !f.isinsurancefee).map((f: any) => `${f.extrafeeid}:${f.qty}`).join(',');
          const tr = ({ auto: 1, manual: 2 } as Record<string, number>)[String(b.transmission || '').toLowerCase()] ?? 0;
          const data = b64(`${customerData(profile!, existing, true)}|${opt}||${Date.now()}`);
          await rcmGet(`/booking/v3.1/${RCM_KEY}/editbooking/${b.reservationref}/${b.pickuplocationid}/2/${ins}/${b.kmcharges_id || 0}/${tr}/0/?${data}`);
        } else {
          const existing = (info.extradrivers || []) as any[];
          const key = (f: unknown, l: unknown) => `${clean(f).toLowerCase()}|${clean(l).toLowerCase()}`;
          for (const d of drivers) {
            const match = existing.find((e) => key(e.firstname, e.lastname) === key(d.first_name, d.last_name));
            const person = { ...d, mobile: d.phone, phone: '' };
            const data = b64(`${extraDriverData(person, match)}|${Date.now()}`);
            await rcmGet(`/booking/v3.1/${RCM_KEY}/extradriver/${b.reservationref}/${match ? match.customerid : 0}/?${data}`);
          }
          if (removed) {
            const match = existing.find((e) => key(e.firstname, e.lastname) === `${removed.first}|${removed.last}`);
            if (match) await rcmGet(`/booking/v3.1/${RCM_KEY}/extradriver/${b.reservationref}/-${match.customerid}/?`);
          }
        }
        synced.push(label);
      } catch (e) {
        failed.push({ booking: label, error: (e as Error).message });
      }
    }

    console.log('rcm-sync-profile', { user: user.id, action, synced, skipped, failed });
    return json({ synced, skipped, failed });
  } catch (e) {
    console.error('rcm-sync-profile error', e);
    return json({ error: (e as Error).message }, 500);
  }
});
