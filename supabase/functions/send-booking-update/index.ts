import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const STAFF_EMAIL = 'info@jamesblond.co.nz';
const FROM_EMAIL = 'James Blond Rentals <info@jamesblond.co.nz>';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    // Require a signed-in customer
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return json({ error: 'Not signed in' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user?.email) return json({ error: 'Not signed in' }, 401);

    const body = await req.json().catch(() => null);
    const bookingRef = String(body?.bookingRef || '').trim().slice(0, 50);
    const message = String(body?.message || '').trim().slice(0, 5000);
    if (!bookingRef) return json({ error: 'bookingRef is required' }, 400);
    if (!message) return json({ error: 'message is required' }, 400);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) return json({ error: 'Email service not configured' }, 500);

    const customerName = String(user.user_metadata?.full_name || '').trim();
    const safeName = escapeHtml(customerName || user.email);
    const safeEmail = escapeHtml(user.email);
    const safeRef = escapeHtml(bookingRef);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a5f;">Booking update request – ${safeRef}</h2>
        <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
        <p><strong>Booking reference:</strong> ${safeRef}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
        <p style="white-space: normal;">${safeMessage}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
        <p style="color: #6b7280; font-size: 12px;">Sent from the customer portal. Reply goes directly to the customer.</p>
      </div>`;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [STAFF_EMAIL],
        reply_to: [user.email],
        subject: `Booking update request – ${bookingRef}`,
        html,
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error('Resend API error:', resendData);
      return json({ error: 'Failed to send email' }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('send-booking-update error:', err);
    return json({ error: 'Unexpected error' }, 500);
  }
});
