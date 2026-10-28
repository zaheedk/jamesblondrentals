// Admin-only daily report of phone assistant calls, read live from ElevenLabs.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { callerPhone, classifyCall, nzDay } from "./classify.ts";

const json = (d: unknown, status = 200) =>
  new Response(JSON.stringify(d), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
  const uc = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: claims } = await uc.auth.getClaims(auth.slice(7));
  const uid = claims?.claims?.sub;
  if (!uid) return json({ error: "Unauthorized" }, 401);
  const { data: isAdmin } = await uc.rpc("has_role", { _user_id: uid, _role: "admin" });
  if (!isAdmin) return json({ error: "Forbidden" }, 403);

  let days = 30;
  try { const b = await req.json(); days = Math.min(90, Math.max(1, Number(b?.days) || 30)); } catch { /* default */ }

  const key = Deno.env.get("ELEVENLABS_API_KEY");
  const agentId = Deno.env.get("VOICE_AGENT_ID");
  if (!key || !agentId) return json({ error: "Phone assistant not configured" }, 500);

  const after = Math.floor(Date.now() / 1000) - days * 86400;
  const calls: any[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 30; page++) {
    const u = new URL("https://api.elevenlabs.io/v1/convai/conversations");
    u.searchParams.set("agent_id", agentId);
    u.searchParams.set("page_size", "100");
    u.searchParams.set("call_start_after_unix", String(after));
    if (cursor) u.searchParams.set("cursor", cursor);
    const res = await fetch(u, { headers: { "xi-api-key": key } });
    if (!res.ok) return json({ error: `ElevenLabs [${res.status}]: ${await res.text()}` }, 502);
    const d = await res.json();
    const batch = (d.conversations || []).filter((c: any) => c.start_time_unix_secs >= after);
    calls.push(...batch);
    if (!d.has_more || !d.next_cursor || batch.length === 0) break;
    cursor = d.next_cursor;
  }

  const byDay: Record<string, { date: string; answered: number; dropped: number; partial: number; completed: number }> = {};
  const list = calls.map((c) => {
    const outcome = classifyCall(c);
    const date = nzDay(c.start_time_unix_secs);
    byDay[date] ??= { date, answered: 0, dropped: 0, partial: 0, completed: 0 };
    byDay[date].answered++;
    byDay[date][outcome]++;
    return {
      id: c.conversation_id, start: c.start_time_unix_secs, duration: c.call_duration_secs,
      title: c.call_summary_title || null, language: c.main_language, outcome, tools: c.tool_names || [],
    };
  });
  // Caller numbers live in each call's detail; fetch for the 150 most recent calls.
  const recent = list.slice(0, 150);
  for (let i = 0; i < recent.length; i += 10) {
    await Promise.all(recent.slice(i, i + 10).map(async (c: any) => {
      try {
        const r = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${c.id}`, { headers: { "xi-api-key": key } });
        if (!r.ok) return;
        const d = await r.json();
        const params: string[] = [];
        for (const m of d.transcript || []) for (const t of m.tool_calls || []) if (t.params_as_json) params.push(t.params_as_json);
        const p = callerPhone(d.metadata?.phone_call?.external_number, params);
        c.phone = p.phone; c.phone_source = p.source;
        c.summary = d.analysis?.transcript_summary || null;
      } catch { /* leave without phone */ }
    }));
  }
  return json({ days: Object.values(byDay).sort((a, b) => b.date.localeCompare(a.date)), calls: list });
});
