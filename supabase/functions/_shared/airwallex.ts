// Shared Airwallex helpers used by the Airwallex/Klarna checkout functions.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

/** Airwallex has separate demo and production hosts. */
export function getAirwallexEnv(): { apiBase: string; checkoutBase: string; isDemo: boolean } {
  const env = (Deno.env.get('AIRWALLEX_ENV') || 'demo').toLowerCase()
  const isDemo = env !== 'live' && env !== 'production' && env !== 'prod'
  return {
    isDemo,
    apiBase: isDemo ? 'https://api-demo.airwallex.com' : 'https://api.airwallex.com',
    checkoutBase: isDemo
      ? 'https://checkout-demo.airwallex.com'
      : 'https://checkout.airwallex.com',
  }
}

let cachedToken: { token: string; expiresAt: number } | null = null

/** Exchange client id + api key for a short-lived bearer token. */
export async function getAirwallexToken(): Promise<string> {
  const clientId = Deno.env.get('AIRWALLEX_CLIENT_ID')
  const apiKey = Deno.env.get('AIRWALLEX_API_KEY')
  if (!clientId || !apiKey) {
    throw new Error('Airwallex credentials are not configured')
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  const { apiBase } = getAirwallexEnv()
  const res = await fetch(`${apiBase}/api/v1/authentication/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
      'x-api-key': apiKey,
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body?.token) {
    console.error('Airwallex login failed', res.status, body)
    throw new Error('Airwallex authentication failed')
  }

  // Tokens are valid for 30 minutes; cache conservatively.
  cachedToken = { token: body.token, expiresAt: Date.now() + 20 * 60_000 }
  return body.token
}

export async function airwallexRequest<T>(
  method: 'GET' | 'POST',
  path: string,
  payload?: unknown,
): Promise<T> {
  const token = await getAirwallexToken()
  const { apiBase } = getAirwallexEnv()

  const res = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('Airwallex API error', method, path, res.status, body)
    throw new Error(
      typeof body?.message === 'string' ? body.message : `Airwallex request failed (${res.status})`,
    )
  }
  return body as T
}

/** Map an Airwallex payment intent status onto the statuses the app already understands. */
export function normaliseIntentStatus(status?: string): 'Approved' | 'Failed' | 'Pending' | 'Unknown' {
  switch (status) {
    case 'SUCCEEDED':
    case 'CAPTURED':
      return 'Approved'
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'Failed'
    case 'REQUIRES_PAYMENT_METHOD':
    case 'REQUIRES_CUSTOMER_ACTION':
    case 'REQUIRES_CAPTURE':
    case 'PENDING':
    case 'CREATED':
      return 'Pending'
    default:
      return 'Unknown'
  }
}

export function str(v: unknown, max = 200): string {
  return typeof v === 'string' ? v.slice(0, max) : ''
}
