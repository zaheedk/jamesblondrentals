import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { validateDemoCall } from "./policy.ts";

const schema = z.object({
  apiKey: z.string().trim().min(1).max(200),
  secret: z.string().min(1).max(500),
  payload: z.record(z.unknown()),
  confirmLiveWrite: z.boolean().default(false),
});
const headers = { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

// Broker credentials are transient inputs: authenticated by the existing gateway,
// never saved, echoed, logged, or accepted as a destination URL.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ status: "ERR", error: "POST required" }, 405);
  try {
    const text = await req.text();
    if (text.length > 200_000) return reply({ status: "ERR", error: "Request too large" }, 413);
    const parsed = schema.safeParse(JSON.parse(text));
    if (!parsed.success) return reply({ status: "ERR", error: "Broker credentials and a valid request are required." }, 400);
    const { apiKey, secret, payload, confirmLiveWrite } = parsed.data;
    const invalid = validateDemoCall(payload, confirmLiveWrite);
    if (invalid) return reply({ status: "ERR", error: invalid }, 400);
    if ("apikey" in payload || "signature" in payload) return reply({ status: "ERR", error: "Put credentials only in the connection fields." }, 400);
    const body = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const signature = Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    const endpoint = new URL("https://api.jamesblond.co.nz/agent/booking/v3.2/");
    endpoint.searchParams.set("apikey", apiKey);
    // One relay attempt only. The existing gateway has its own retry behaviour.
    const response = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json", signature }, body,
      signal: AbortSignal.timeout(55_000),
    });
    const result = await response.json().catch(() => null);
    if (!result) return reply({ status: "ERR", error: "Non-JSON response. If this was a write, its outcome is unknown; look it up before resubmitting." }, 502);
    // Never return reflected credentials even if an upstream error includes them.
    const safe = JSON.stringify(result).split(apiKey).join("[redacted]").split(secret).join("[redacted]");
    return new Response(safe, { status: response.status, headers });
  } catch {
    return reply({ status: "ERR", error: "Request could not complete. A write may have succeeded; reconcile before resubmitting." }, 502);
  }
});