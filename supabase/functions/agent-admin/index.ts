// Admin-only management of broker API keys.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function randomToken(len: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

  const url = Deno.env.get("SUPABASE_URL")!;
  const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
  const { data: claims } = await userClient.auth.getClaims(auth.slice(7));
  const uid = claims?.claims?.sub;
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: uid, _role: "admin" });
  if (!isAdmin) return json({ error: "Forbidden" }, 403);

  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === "list") {
    const { data } = await admin.from("agent_brokers")
      .select("id, name, api_key, rcm_credential_ref, active, rate_limit_per_min, created_at").order("created_at");
    const { data: logs } = await admin.from("agent_api_log")
      .select("id, broker_id, method, status, error, duration_ms, created_at").order("created_at", { ascending: false }).limit(100);
    return json({ brokers: data ?? [], logs: logs ?? [] });
  }

  if (action === "create") {
    const name = String(body.name ?? "").trim().slice(0, 100);
    const ref = String(body.rcm_credential_ref ?? "").trim().toUpperCase();
    if (!name || !/^[A-Z0-9_]{2,40}$/.test(ref)) return json({ error: "Name and RCM account are required" }, 400);
    if (!Deno.env.get(`${ref}_RCM_API_KEY`) || !Deno.env.get(`${ref}_RCM_SHARED_SECRET`))
      return json({ error: `RCM credentials ${ref}_RCM_API_KEY / ${ref}_RCM_SHARED_SECRET are not stored yet` }, 400);
    const api_key = "JB" + randomToken(30);
    const shared_secret = randomToken(48);
    const { data, error } = await admin.from("agent_brokers")
      .insert({ name, rcm_credential_ref: ref, api_key, shared_secret }).select("id").single();
    if (error) return json({ error: error.message }, 400);
    return json({ id: data.id, api_key, shared_secret });
  }

  if (action === "rotate") {
    const shared_secret = randomToken(48);
    const { error } = await admin.from("agent_brokers").update({ shared_secret }).eq("id", body.id);
    if (error) return json({ error: error.message }, 400);
    return json({ shared_secret });
  }

  if (action === "toggle") {
    const { error } = await admin.from("agent_brokers").update({ active: !!body.active }).eq("id", body.id);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: "Unknown action" }, 400);
});
