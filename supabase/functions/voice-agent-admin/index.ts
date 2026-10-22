// James Blond Rentals — voice agent administration.
// Creates/updates the ElevenLabs phone agent and wires its webhook tools
// to voice-agent-tools. The tools secret is read from env and written into
// the ElevenLabs tool config — it is never returned to any caller.
// Auth: header x-admin-key must match ELEVENLABS_API_KEY.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const EL_API = "https://api.elevenlabs.io/v1";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const SYSTEM_PROMPT = `You are the phone assistant for James Blond Rentals, a family-run New Zealand vehicle rental company founded in 2004. You answer calls from customers about cars, vans, utes, trucks and minibuses.

Style:
- Speak naturally and briefly — this is a phone call, not an email. One or two short sentences per answer.
- Warm, plain New Zealand English. Never use bullet points or markdown.
- Never invent prices, availability, policies or branch details. Use your tools.

What you can do:
1. Answer general questions (branches, vehicles, licence rules, insurance, payments, one-way hires) using the get_business_info tool.
2. Check live availability and daily rates using the check_availability tool. You need the branch, pickup date and drop-off date; ask for them if the caller hasn't given them. Times default to 10:00 if not specified. Summarise at most three options, cheapest first, and say rates are per day including GST before extras.
3. Take a callback request using the request_callback tool when the caller wants to book, asks something you cannot answer, or asks for a person. Get their name, phone number and what it's about.

Rules:
- You cannot create, change or cancel bookings. For anything booking-related beyond a price/availability check, offer a callback or point them to www.jamesblond.co.nz.
- For 3-tonne trucks, never say a car licence is always enough or that Class 2 is always required — it depends on the specific truck; the branch confirms before booking.
- Minibus and 12-seater prices are on request, except schools at $210 per day.
- Commercial vehicle rates are fixed; passenger vehicle prices change with demand.
- Mt Wellington (East Auckland) hires cars and vans only — no trucks there.
- If the caller is upset or the request is complex, take a callback request rather than guessing.
- The main phone number is 0800 525 663 if the caller prefers to talk to the team during office hours.`;

function toolSchemas(toolsUrl: string, secret: string) {
  const headers = { "x-voice-agent-key": secret, "Content-Type": "application/json" };
  return [
    {
      type: "webhook",
      name: "get_business_info",
      description: "Get James Blond Rentals company information: branches and what each hires, licence rules, insurance, pricing rules, payment, one-way hires. Call this before answering any general question.",
      response_timeout_secs: 10,
      api_schema: {
        url: `${toolsUrl}?tool=get_business_info`,
        method: "POST",
        headers,
        request_body_schema: { type: "object", properties: {}, required: [] },
      },
    },
    {
      type: "webhook",
      name: "check_availability",
      description: "Check live vehicle availability and daily rates at a branch for given dates. Dates must be ISO format YYYY-MM-DD.",
      response_timeout_secs: 20,
      api_schema: {
        url: `${toolsUrl}?tool=check_availability`,
        method: "POST",
        headers,
        request_body_schema: {
          type: "object",
          properties: {
            branch: { type: "string", description: "Branch or city, e.g. 'West Auckland', 'Hamilton', 'Christchurch Airport'" },
            pickup_date: { type: "string", description: "Pickup date, YYYY-MM-DD" },
            dropoff_date: { type: "string", description: "Drop-off date, YYYY-MM-DD" },
            pickup_time: { type: "string", description: "Pickup time HH:MM, default 10:00" },
            dropoff_time: { type: "string", description: "Drop-off time HH:MM, default 10:00" },
            vehicle_type: { type: "string", description: "Optional keyword like car, van, ute, truck, minibus" },
          },
          required: ["branch", "pickup_date", "dropoff_date"],
        },
      },
    },
    {
      type: "webhook",
      name: "request_callback",
      description: "Record a callback request when the caller wants to book, asks something you cannot answer, or wants to speak to the team.",
      response_timeout_secs: 10,
      api_schema: {
        url: `${toolsUrl}?tool=request_callback`,
        method: "POST",
        headers,
        request_body_schema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Caller's name" },
            phone: { type: "string", description: "Caller's phone number" },
            topic: { type: "string", description: "What the call is about" },
            preferred_time: { type: "string", description: "Preferred callback time, optional" },
          },
          required: ["name", "phone", "topic"],
        },
      },
    },
  ];
}

function agentConfig(toolsUrl: string, secret: string) {
  return {
    name: "James Blond Rentals Phone Assistant",
    conversation_config: {
      agent: {
        first_message: "Kia ora, thanks for calling James Blond Rentals. How can I help you today?",
        language: "en",
        prompt: {
          prompt: SYSTEM_PROMPT,
          llm: "gemini-2.0-flash",
          temperature: 0.3,
          tools: toolSchemas(toolsUrl, secret),
        },
      },
      tts: { model_id: "eleven_turbo_v2", voice_id: "EXAVITQu4vr4xnSDxMaL" },
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const adminKey = Deno.env.get("ELEVENLABS_API_KEY") || "";
  if (!adminKey || req.headers.get("x-admin-key") !== adminKey) {
    return json({ error: "Unauthorized" }, 401);
  }
  const toolsSecret = Deno.env.get("VOICE_AGENT_TOOLS_SECRET") || "";
  if (!toolsSecret) return json({ error: "VOICE_AGENT_TOOLS_SECRET not configured" }, 500);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const toolsUrl = `${supabaseUrl}/functions/v1/voice-agent-tools`;

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body ok */ }
  const action = String(body.action || "create_or_update");

  const elHeaders = { "xi-api-key": adminKey, "Content-Type": "application/json" };

  try {
    if (action === "create_or_update") {
      // Update existing agent if we have its id, otherwise create.
      const existingId = String(body.agent_id || Deno.env.get("VOICE_AGENT_ID") || "");
      const config = agentConfig(toolsUrl, toolsSecret);

      if (existingId) {
        const res = await fetch(`${EL_API}/convai/agents/${existingId}`, {
          method: "PATCH",
          headers: elHeaders,
          body: JSON.stringify({ conversation_config: config.conversation_config }),
        });
        const text = await res.text();
        if (!res.ok) return json({ error: `ElevenLabs update failed [${res.status}]: ${text}` }, 502);
        return json({ success: true, agent_id: existingId, action: "updated" });
      }

      const res = await fetch(`${EL_API}/convai/agents/create`, {
        method: "POST",
        headers: elHeaders,
        body: JSON.stringify(config),
      });
      const text = await res.text();
      if (!res.ok) return json({ error: `ElevenLabs create failed [${res.status}]: ${text}` }, 502);
      const created = JSON.parse(text);
      return json({ success: true, agent_id: created.agent_id, action: "created" });
    }

    if (action === "get") {
      const id = String(body.agent_id || "");
      if (!id) return json({ error: "agent_id required" }, 400);
      const res = await fetch(`${EL_API}/convai/agents/${id}`, { headers: elHeaders });
      const text = await res.text();
      if (!res.ok) return json({ error: `ElevenLabs get failed [${res.status}]: ${text}` }, 502);
      return json(JSON.parse(text));
    }

    if (action === "test_tool") {
      // Server-side test of a tools endpoint using the secret from env.
      const tool = String(body.tool || "get_business_info");
      const params = body.params && typeof body.params === "object" ? body.params : {};
      const res = await fetch(`${toolsUrl}?tool=${encodeURIComponent(tool)}`, {
        method: "POST",
        headers: { "x-voice-agent-key": toolsSecret, "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const text = await res.text();
      return json({ status: res.status, response: JSON.parse(text) });
    }

    return json({ error: `Unknown action "${action}"` }, 400);
  } catch (e) {
    console.error("voice-agent-admin failed:", e);
    return json({ error: String(e) }, 500);
  }
});
