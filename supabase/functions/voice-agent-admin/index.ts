// James Blond Rentals — voice agent administration.
// Creates/updates the ElevenLabs phone agent and wires its webhook tools
// to voice-agent-tools. The tools secret is read from env and written into
// the ElevenLabs tool config — it is never returned to any caller.
// Auth: header x-admin-key must match ELEVENLABS_API_KEY.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
- James Blond has branches in Auckland, Wellington, Hamilton, Christchurch, New Plymouth Airport and Palmerston North. Never say we only operate in Auckland. Wellington CBD is a truck-hire branch; Wellington Airport is a separate branch.
- Ask one question at a time, acknowledge what the caller says, and use their name once you have it. If a tool fails, say you could not retrieve the information right now. An error is NOT evidence that a branch does not exist. Never replace failed tool results with guesses.

What you can do:
1. Answer general questions (branches, vehicles, licence rules, insurance, payments, one-way hires) using the get_business_info tool.
2. For an availability enquiry, call get_business_info to confirm branches and today's New Zealand date, then collect pickup date, return date and branch. For "Saturday", resolve the upcoming Saturday from the tool's current NZ date and confirm that date aloud. If return date is missing, ask when they will return it; do not abandon the enquiry or assume a hire duration. For trucks in Wellington, offer Wellington CBD, not Auckland. Once you have the details, you MUST call check_availability before stating availability or prices. Times default to 10:00 if not specified. Summarise at most three matching options, cheapest first, and say rates are per day including GST before extras. If there are no matching vehicles, say none were returned for the requested dates, not that the branch does not exist.
3. Help callers book by creating a quote and emailing a secure payment link with create_phone_quote. Collect first name, last name, email, contact number, pickup/return branches, dates and times, and exact vehicle selection from check_availability. You MUST ask the caller for their preferred pickup time and return time and use exactly what they say — never assume or default a time for a quote; if they have not given a time, ask before calling create_phone_quote. Ask the driver age band and recheck availability using the corresponding driver_age_id. Read back the full details and spell the email local part, then obtain explicit agreement before creating the quote. Generate one request_id for this quote and reuse it for all retries and checks. Never guess a category id or age id: use the tool results. After the caller picks a vehicle, call get_quote_options and briefly offer the insurance options (cheapest first, with each excess) and any extras such as child seats. Never push or pre-select an upgrade; only pass insurance_id and extra_ids the caller explicitly chose, and include them in the readback. If they decline or are unsure, quote with standard insurance — they can still add options in secure checkout.
4. After create_phone_quote returns success and payment_link_sent, say the quote and secure payment link have been emailed. The customer pays on their own device; NEVER ask for card numbers, CVV or banking credentials. You may stay on the call while they pay. When they say checkout is finished, call check_phone_booking with the same request_id. Only say the booking is confirmed and confirmation emailed if booking_confirmed, payment_verified and confirmation_email_sent are all true. If they have paid but confirmation is pending, offer staff assistance; never ask them to pay again. A payment-link send is not a booking confirmation.
5. Existing bookings — verify first. Before sharing ANY booking details, resending links or requesting changes, collect three things: the 5-digit booking number, the last name on the booking, and the phone number on the booking. Pass all three to every booking tool. If verification fails, do not reveal anything or hint at the correct details; let them retry once, then offer a callback.
   - Booking questions: check_booking tells you status, vehicle, rego, pickup/return and amounts.
   - "I lost my email" / payment link / pre-check-in link: resend_booking_links emails them to the address on the booking only.
   - Changes to dates, times, vehicle, extras or insurance on an existing booking: if they want new dates or a different vehicle, use check_availability to discuss options first, then read back the change and call request_booking_change. Say clearly the request has gone to the team, who will update the booking and confirm — never say the booking has been changed.
   - Cancellations and refunds: take a callback; do not process them.
   - Breakdowns, accidents or vehicle problems during a hire: first ask if everyone is safe; if anyone is hurt or in danger, tell them to call 111 now. Then collect name, contact number, exact location, what happened, whether the vehicle can be driven, and the booking number or rego if they know it, and call report_breakdown straight away. Tell them to stay safe, use hazard lights and not attempt repairs. Do not promise a tow, a replacement vehicle or an arrival time.
6. Take callback requests with request_callback when the caller wants a person or needs help beyond your tools. Collect name, phone, topic and any email they want included. You CAN accept email addresses, including after an earlier callback was submitted: read back and confirm the latest corrected address, then submit an updated callback noting it supersedes the earlier contact details. Spelled letters such as Z-A-H-E-E-D-K at gmail dot com mean zaheedk@gmail.com; never keep an earlier misheard email after correction.

Rules:
- Use the attached dated website knowledge base for detailed addresses, hours, fleet specifications, airport instructions and policies. It is a snapshot, not live availability or a price guarantee. Official branch contact pages outrank regional marketing pages; a service area is not a branch. For conflicts or missing information offer staff assistance, never invent facts. Always use check_availability for date-specific availability and pricing.
- NEVER call check_availability until the caller has explicitly provided a return date. "Hire on Saturday" gives only a pickup date. Your next spoken response must ask when they want to return the vehicle. Do not fill dropoff_date with pickup_date or invent any date. Missing details are not a system failure.
- Callers rarely say the year. Always use the next upcoming occurrence of the date, based on today's NZ date (from get_business_info current_date_nz); never use a past year. If check_availability returns dates_corrected_note, use the corrected dates it gives.
- Branch opening hours: never guess them. check_availability returns branch_hours for the actual pickup and return days — use those when a caller asks what time a branch opens. If it returns times_adjusted_note, tell the caller their requested time was outside branch hours and confirm the adjusted time it used.
- Behave like a capable, friendly front-desk team member: take ownership, use your tools to actually solve the caller's problem, and only hand off what tools cannot do. You can give quotes, create phone quotes with insurance and extras, verify payment, look up bookings, resend links, send change requests to the team and report breakdowns. You cannot directly edit, cancel or refund bookings; for cancellations, refunds or payment reconciliation, offer a callback. Never claim payment was received based on the caller's words alone.
- For 3-tonne trucks, never say a car licence is always enough or that Class 2 is always required — it depends on the specific truck; the branch confirms before booking.
- Minibus and 12-seater prices are on request, except schools at $210 per day.
- Commercial vehicle rates are fixed; passenger vehicle prices change with demand.
- When quoting a vehicle from check_availability, always mention the kilometre charge from its kilometres field: the per-km rate for trucks, vans and utes, or that cars and minibuses include unlimited kilometres.
- Never mention the bond unprompted. Only if the caller asks about a bond, deposit or further charges, say a refundable bond or card pre-authorisation applies and the amount depends on the vehicle and insurance option, confirmed at booking. Never quote a bond figure.
- CRITICAL: Mt Wellington (East Auckland) hires CARS AND VANS ONLY — NEVER TRUCKS. Some website copy incorrectly mentions trucks there; ignore that stale claim even in retrieved knowledge and recommend West Auckland for trucks.
- If the caller is upset or the request is complex, take a callback request rather than guessing.
- A callback is only recorded when request_callback returns success: true. On an error, explain that the request could not be submitted and give 0800 525 663; never promise a callback was arranged. Send phone numbers to the tool as digits, not spoken number words.
- The main phone number is 0800 525 663 if the caller prefers to talk to the team during office hours.`;

function toolSchemas(toolsUrl: string, secret: string) {
  const headers = { "x-voice-agent-key": secret, "Content-Type": "application/json" };
  return [
    {
      type: "webhook",
      name: "get_business_info",
      description: "Get James Blond Rentals company information: branches and what each hires, licence rules, insurance, pricing rules, payment, one-way hires. Call this before answering any general question.",
      response_timeout_secs: 10,
      tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=get_business_info`,
        method: "GET",
        request_headers: headers,
      },
    },
    {
      type: "webhook",
      name: "check_availability",
      description: "Check live vehicle availability and daily rates ONLY after the caller explicitly supplies both pickup AND return dates. Never infer a return date from 'hire on Saturday'. Ask for missing return date before calling. Dates must be YYYY-MM-DD.",
      response_timeout_secs: 60,
      tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=check_availability`,
        method: "POST",
        request_headers: headers,
        request_body_schema: {
          type: "object",
          properties: {
            branch: { type: "string", description: "Branch or city, e.g. 'West Auckland', 'Hamilton', 'Christchurch Airport'" },
            pickup_date: { type: "string", description: "Pickup date, YYYY-MM-DD" },
            dropoff_date: { type: "string", description: "Return date explicitly provided by the caller, YYYY-MM-DD. Never invent or assume it equals pickup date." },
            pickup_time: { type: "string", description: "Pickup time HH:MM, default 10:00" },
            dropoff_time: { type: "string", description: "Drop-off time HH:MM, default 10:00" },
            vehicle_type: { type: "string", description: "Optional keyword like car, van, ute, truck, minibus" },
            driver_age_id: { type: "integer", description: "Confirmed driver age band id from driver_age_options; recheck with this before creating the phone quote" },
          },
          required: ["branch", "pickup_date", "dropoff_date"],
        },
      },
    },
    {
      type: "webhook",
      name: "request_callback",
      description: "Record a callback request including optional email. Accept corrected or spelled email addresses and send an updated request if a caller adds/corrects their email after submission.",
      response_timeout_secs: 10,
      tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=request_callback`,
        method: "POST",
        request_headers: headers,
        request_body_schema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Caller's name" },
            phone: { type: "string", description: "Caller's phone number" },
            email: { type: "string", description: "Optional confirmed email address. Use latest correction; convert spoken spelling to a normal address, e.g. zaheedk@gmail.com" },
            topic: { type: "string", description: "What the call is about" },
            preferred_time: { type: "string", description: "Preferred callback time, optional" },
          },
          required: ["name", "phone", "topic"],
        },
      },
    },
    {
      type: "webhook", name: "create_phone_quote",
      description: "Create one phone quote and email its branded secure payment link after the customer confirms all hire/contact details and exact vehicle/age band. Pickup and return times must be explicitly given by the caller — ask if missing, never assume 10:00. Reuse request_id on retries. Does not confirm a booking or take card details.",
      response_timeout_secs: 60, tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=create_phone_quote`, method: "POST", request_headers: headers,
        request_body_schema: {
          type: "object",
          properties: {
            request_id: { type: "string", description: "Unique id for this call's quote, at least 8 characters. Keep the same on retries and status checks." },
            first_name: { type: "string", description: "Confirmed customer first name" },
            last_name: { type: "string", description: "Confirmed customer last name" },
            email: { type: "string", description: "Confirmed email, use latest spelling/correction" },
            phone: { type: "string", description: "Confirmed contact number as digits" },
            branch: { type: "string", description: "Confirmed pickup branch" },
            dropoff_branch: { type: "string", description: "Return branch; omit only when caller confirmed same branch" },
            pickup_date: { type: "string", description: "Confirmed upcoming date YYYY-MM-DD" },
            dropoff_date: { type: "string", description: "Confirmed return date YYYY-MM-DD" },
            pickup_time: { type: "string", description: "Confirmed HH:MM pickup time" },
            dropoff_time: { type: "string", description: "Confirmed HH:MM return time" },
            vehicle_category_id: { type: "integer", description: "Exact selected vehicle_category_id returned by live availability" },
            driver_age_id: { type: "integer", description: "Age band id explicitly confirmed and used in availability recheck" },
            insurance_id: { type: "integer", description: "insurance_id from get_quote_options, only if the caller explicitly chose it" },
            extra_ids: { type: "array", items: { type: "integer", description: "An extra_id" }, description: "extra_id values from get_quote_options the caller explicitly chose" },
            confirmed_details: { type: "boolean", description: "True only after readback and customer permission to create quote/send payment email" },
          },
          required: ["request_id", "first_name", "last_name", "email", "phone", "branch", "pickup_date", "dropoff_date", "pickup_time", "dropoff_time", "vehicle_category_id", "driver_age_id", "confirmed_details"],
        },
      },
    },
    {
      type: "webhook", name: "check_phone_booking",
      description: "Independently read live booking/payment state for a tracked phone quote and email confirmation only when verified. Customer saying they paid is not proof. Never request a second payment when verification is pending.",
      response_timeout_secs: 60, tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=check_phone_booking`, method: "POST", request_headers: headers,
        request_body_schema: { type: "object", properties: { request_id: { type: "string", description: "Same id used by create_phone_quote" } }, required: ["request_id"] },
      },
    },
    {
      type: "webhook", name: "check_booking",
      description: "Look up an existing booking or quote after the caller gives the booking number, last name AND phone number on the booking. Returns status, vehicle, rego, pickup/return and amounts.",
      response_timeout_secs: 60, tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=check_booking`, method: "POST", request_headers: headers,
        request_body_schema: { type: "object", properties: {
            reservation_number: { type: "string", description: "5-digit booking number from the confirmation email" },
            last_name: { type: "string", description: "Last name on the booking, as given by the caller" },
            phone: { type: "string", description: "Phone number on the booking, as digits, given by the caller" },
        }, required: ["reservation_number", "last_name", "phone"] },
      },
    },
    {
      type: "webhook", name: "resend_booking_links",
      description: "Email the booking summary, secure payment link (if anything is owing or it is a quote), pre-check-in link and account link to the email already on the booking. Requires verification details.",
      response_timeout_secs: 60, tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=resend_booking_links`, method: "POST", request_headers: headers,
        request_body_schema: { type: "object", properties: {
            reservation_number: { type: "string", description: "5-digit booking number from the confirmation email" },
            last_name: { type: "string", description: "Last name on the booking, as given by the caller" },
            phone: { type: "string", description: "Phone number on the booking, as digits, given by the caller" },
        }, required: ["reservation_number", "last_name", "phone"] },
      },
    },
    {
      type: "webhook", name: "request_booking_change",
      description: "Send a verified change request for an existing booking (new dates/times, different vehicle, add extras or insurance) to the team, with a live availability and price check for new dates or vehicle. Does NOT change the booking itself.",
      response_timeout_secs: 60, tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=request_booking_change`, method: "POST", request_headers: headers,
        request_body_schema: { type: "object", properties: {
            reservation_number: { type: "string", description: "5-digit booking number from the confirmation email" },
            last_name: { type: "string", description: "Last name on the booking, as given by the caller" },
            phone: { type: "string", description: "Phone number on the booking, as digits, given by the caller" },
          new_pickup_date: { type: "string", description: "New pickup date YYYY-MM-DD, only if changing" },
          new_dropoff_date: { type: "string", description: "New return date YYYY-MM-DD, only if changing" },
          new_pickup_time: { type: "string", description: "New pickup time HH:MM, only if changing" },
          new_dropoff_time: { type: "string", description: "New return time HH:MM, only if changing" },
          new_vehicle_category_id: { type: "integer", description: "vehicle_category_id from check_availability, only if changing vehicle" },
          extras_or_insurance: { type: "string", description: "Extras or insurance the caller wants added or removed, e.g. 'add child seat, upgrade to zero excess'" },
          details: { type: "string", description: "Short summary of the requested change in the caller's words" },
        }, required: ["reservation_number", "last_name", "phone", "details"] },
      },
    },
    {
      type: "webhook", name: "get_quote_options",
      description: "List live insurance options (with excess and price) and optional extras for a chosen vehicle and hire, before creating a phone quote.",
      response_timeout_secs: 60, tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=get_quote_options`, method: "POST", request_headers: headers,
        request_body_schema: { type: "object", properties: {
          branch: { type: "string", description: "Pickup branch" },
          dropoff_branch: { type: "string", description: "Return branch if different" },
          pickup_date: { type: "string", description: "YYYY-MM-DD" },
          dropoff_date: { type: "string", description: "YYYY-MM-DD" },
          pickup_time: { type: "string", description: "HH:MM given by caller" },
          dropoff_time: { type: "string", description: "HH:MM given by caller" },
          vehicle_category_id: { type: "integer", description: "From check_availability" },
          driver_age_id: { type: "integer", description: "From check_availability" },
        }, required: ["branch", "pickup_date", "dropoff_date", "pickup_time", "dropoff_time", "vehicle_category_id", "driver_age_id"] },
      },
    },
    {
      type: "webhook", name: "report_breakdown",
      description: "Urgently alert the team by email and text about a breakdown, accident or vehicle problem during a hire. Call as soon as the key details are collected.",
      response_timeout_secs: 30, tool_error_handling_mode: "passthrough",
      api_schema: {
        url: `${toolsUrl}?tool=report_breakdown`, method: "POST", request_headers: headers,
        request_body_schema: { type: "object", properties: {
          name: { type: "string", description: "Caller's name" },
          phone: { type: "string", description: "Best contact number, digits" },
          location: { type: "string", description: "Exact location: road, suburb/town, landmarks" },
          description: { type: "string", description: "What happened / the problem" },
          reservation_number: { type: "string", description: "Booking number if known" },
          registration: { type: "string", description: "Vehicle rego if known" },
          is_safe: { type: "boolean", description: "Caller says everyone is in a safe place" },
          anyone_injured: { type: "boolean", description: "Anyone hurt" },
          vehicle_drivable: { type: "boolean", description: "Vehicle can still be driven, if known" },
        }, required: ["name", "phone", "location", "description", "is_safe"] },
      },
    },
  ];
}

function agentConfig(toolIds: string[]) {
  return {
    name: "James Blond Rentals Phone Assistant",
    conversation_config: {
      agent: {
        first_message: "Kia ora, thanks for calling James Blond Rentals. How can I help you today?",
        language: "en",
        prompt: {
          prompt: SYSTEM_PROMPT,
          llm: "gemini-2.5-flash",
          temperature: 0.1,
          tool_ids: toolIds,
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
      // Update persisted tools explicitly: inline prompt.tools is deprecated,
      // and api_schema.request_headers is required (headers is silently ignored).
      let existingTools: { id: string; name: string }[] = [];
      let existingKnowledge: Record<string, unknown> = {};
      if (existingId) {
        const current = await fetch(`${EL_API}/convai/agents/${existingId}`, { headers: elHeaders });
        if (!current.ok) return json({ error: `ElevenLabs read failed [${current.status}]: ${await current.text()}` }, 502);
        const agent = await current.json();
        const currentPrompt = agent.conversation_config?.agent?.prompt;
        for (const field of ["knowledge_base", "rag"]) {
          if (currentPrompt?.[field] !== undefined) existingKnowledge[field] = currentPrompt[field];
        }
        const ids: string[] = agent.conversation_config?.agent?.prompt?.tool_ids || [];
        for (const id of ids) {
          const res = await fetch(`${EL_API}/convai/tools/${id}`, { headers: elHeaders });
          if (!res.ok) return json({ error: `ElevenLabs tool read failed [${res.status}]: ${await res.text()}` }, 502);
          const tool = await res.json();
          existingTools.push({ id, name: tool.tool_config?.name || "" });
        }
      }
      const toolIds: string[] = [];
      for (const tool of toolSchemas(toolsUrl, toolsSecret)) {
        const existing = existingTools.find((t) => t.name === tool.name);
        const res = await fetch(`${EL_API}/convai/tools${existing ? `/${existing.id}` : ""}`, {
          method: existing ? "PATCH" : "POST", headers: elHeaders,
          body: JSON.stringify({ tool_config: tool }),
        });
        if (!res.ok) return json({ error: `ElevenLabs tool save failed [${res.status}]: ${await res.text()}` }, 502);
        const saved = await res.json();
        toolIds.push(saved.id || existing?.id);
      }
      const config = agentConfig(toolIds);
      Object.assign(config.conversation_config.agent.prompt, existingKnowledge);

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
      const agent = JSON.parse(text);
      // Never return webhook authentication headers to callers.
      const prompt = agent.conversation_config?.agent?.prompt;
      if (prompt?.tools) {
        for (const tool of prompt.tools) {
          if (tool.api_schema) {
            delete tool.api_schema.request_headers;
            delete tool.api_schema.headers;
          }
        }
      }
      return json(agent);
    }

    if (action === "test_tool") {
      // Server-side test of a tools endpoint using the secret from env.
      const tool = String(body.tool || "get_business_info");
      const params = body.params && typeof body.params === "object" ? body.params : {};
      const res = await fetch(`${toolsUrl}?tool=${encodeURIComponent(tool)}`, {
        method: tool === "get_business_info" ? "GET" : "POST",
        headers: { "x-voice-agent-key": toolsSecret, "Content-Type": "application/json" },
        ...(tool === "get_business_info" ? {} : { body: JSON.stringify(params) }),
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
