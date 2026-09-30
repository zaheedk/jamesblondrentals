// James Blond Broker API — drop-in replacement for RCM agent API v3.2.
// Brokers change only the endpoint URL + apikey/secret. Same methods, same
// request body, same HMAC-SHA256 "signature" header, same response shapes.
import { createClient } from "npm:@supabase/supabase-js@2";

const RCM_AGENT_URL = "https://apis.rentalcarmanager.com/agent/booking/v3.2/";

// Pricing hook — OFF until RCM is confirmed to book at adjusted prices.
const PRICING_ENABLED = false;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, signature, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const enc = new TextEncoder();

async function hmacHex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function safeEqual(a: string, b: string): boolean {
  const x = enc.encode(a.toUpperCase());
  const y = enc.encode(b.toUpperCase());
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

// RCM returns errors as HTTP 200 {"status":"ERR","error":"..."}
function rcmError(message: string) {
  return new Response(JSON.stringify({ status: "ERR", error: message }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function applyPricing(_method: string, payload: unknown): unknown {
  // Future: adjust step2/step3 rates by demand level.
  return payload;
}

async function log(entry: Record<string, unknown>) {
  try { await admin.from("agent_api_log").insert(entry); } catch (e) { console.error("log failed", e); }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();
  const url = new URL(req.url);
  const apiKey = url.searchParams.get("apikey") ?? req.headers.get("apikey-broker") ?? "";
  const keyPrefix = apiKey.slice(0, 6);

  if (req.method !== "POST") return rcmError("Invalid request method");
  const rawBody = await req.text();
  if (rawBody.length > 200_000) return rcmError("Request too large");

  let method = "";
  try {
    const parsed = JSON.parse(rawBody);
    method = typeof parsed?.method === "string" ? parsed.method : "";
  } catch {
    await log({ api_key_prefix: keyPrefix, status: "ERR", error: "invalid json", duration_ms: Date.now() - started });
    return rcmError("Invalid JSON request");
  }
  if (!method) return rcmError("Parameter[Method] 'method'. Missing");
  if (!apiKey) return rcmError("Invalid API Key");

  const { data: broker } = await admin
    .from("agent_brokers")
    .select("id, shared_secret, rcm_credential_ref, active, rate_limit_per_min")
    .eq("api_key", apiKey)
    .maybeSingle();

  if (!broker || !broker.active) {
    await log({ api_key_prefix: keyPrefix, method, status: "ERR", error: "invalid key", duration_ms: Date.now() - started });
    return rcmError("Invalid API Key");
  }

  const signature = req.headers.get("signature") ?? url.searchParams.get("signature") ?? "";
  const expected = await hmacHex(broker.shared_secret, rawBody);
  if (!signature || !safeEqual(signature, expected)) {
    await log({ broker_id: broker.id, api_key_prefix: keyPrefix, method, status: "ERR", error: "bad signature", duration_ms: Date.now() - started });
    return rcmError("Invalid Signature");
  }

  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await admin
    .from("agent_api_log")
    .select("id", { count: "exact", head: true })
    .eq("broker_id", broker.id)
    .gte("created_at", since);
  if ((count ?? 0) >= broker.rate_limit_per_min) {
    await log({ broker_id: broker.id, api_key_prefix: keyPrefix, method, status: "ERR", error: "rate limited", duration_ms: Date.now() - started });
    return rcmError("Rate limit exceeded, please retry shortly");
  }

  const ref = String(broker.rcm_credential_ref).toUpperCase();
  if (!/^[A-Z0-9_]+$/.test(ref)) return rcmError("Agent configuration error");
  const rcmKey = Deno.env.get(`${ref}_RCM_API_KEY`);
  const rcmSecret = Deno.env.get(`${ref}_RCM_SHARED_SECRET`);
  if (!rcmKey || !rcmSecret) {
    await log({ broker_id: broker.id, api_key_prefix: keyPrefix, method, status: "ERR", error: "missing rcm credentials", duration_ms: Date.now() - started });
    return rcmError("Agent configuration error");
  }

  // Forward the exact body, re-signed with the broker's RCM agent credentials,
  // so RCM stamps the correct agent (commission, invoicing, booking isolation).
  let upstream: Response | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      upstream = await fetch(`${RCM_AGENT_URL}?apikey=${rcmKey.trim()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", signature: await hmacHex(rcmSecret.trim(), rawBody) },
        body: rawBody,
      });
      if (![502, 503, 504].includes(upstream.status)) break;
    } catch (e) {
      console.error("upstream error", e);
      upstream = null;
    }
    await new Promise((r) => setTimeout(r, attempt * 500));
  }
  if (!upstream) {
    await log({ broker_id: broker.id, api_key_prefix: keyPrefix, method, status: "ERR", error: "upstream unreachable", duration_ms: Date.now() - started });
    return rcmError("Service temporarily unavailable");
  }

  let text = await upstream.text();
  let status = "OK";
  try {
    const json = JSON.parse(text);
    if (json?.status === "ERR") status = "ERR";
    if (PRICING_ENABLED && (method === "step2" || method === "step3")) text = JSON.stringify(applyPricing(method, json));
  } catch { status = "NONJSON"; }

  await log({ broker_id: broker.id, api_key_prefix: keyPrefix, method, status, duration_ms: Date.now() - started });
  return new Response(text, {
    status: upstream.status,
    headers: { ...corsHeaders, "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
});
