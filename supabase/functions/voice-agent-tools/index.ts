// James Blond Rentals — voice agent tools.
// Webhook endpoints called by the ElevenLabs phone agent during a call.
// Auth: header x-voice-agent-key must match VOICE_AGENT_TOOLS_SECRET
// (configured on the agent by voice-agent-admin), or x-admin-key must
// match ELEVENLABS_API_KEY (admin/testing only).
import { corsHeaders } from "./cors.ts";
import { matchingVehicles, nzDate, perKmCharge, resolveLocation } from "./availability.ts";

const RCM_API_URL = "https://apis.rentalcarmanager.com/booking/v3.2";
// Same credentials the public website uses (already public in frontend code).
const RCM_API_KEY = Deno.env.get("RCM_SITE_API_KEY") || "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
const RCM_API_SECRET = Deno.env.get("RCM_SITE_API_SECRET") || "tsdavpoP51o6AcLIdorqgtFJ0ullAimg";

const CALLBACK_EMAIL = "zaheed@jamesblond.co.nz";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function authorized(req: Request): boolean {
  const toolKey = Deno.env.get("VOICE_AGENT_TOOLS_SECRET") || "";
  const adminKey = Deno.env.get("ELEVENLABS_API_KEY") || "";
  const gotTool = req.headers.get("x-voice-agent-key") || "";
  const gotAdmin = req.headers.get("x-admin-key") || "";
  return (toolKey.length > 0 && gotTool === toolKey) || (adminKey.length > 0 && gotAdmin === adminKey);
}

// ---------- RCM helpers ----------

const enc = new TextEncoder();

async function hmacHex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function rcmCall(method: string, payload: Record<string, unknown>): Promise<any> {
  const body = JSON.stringify({ method, ...payload });
  const signature = await hmacHex(RCM_API_SECRET, body);
  let res: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(`${RCM_API_URL}?apikey=${RCM_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", signature },
      body,
    });
    if (res.status !== 429) break;
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  if (!res || !res.ok) throw new Error(`Booking system error (${res?.status ?? "no response"})`);
  return res.json();
}

// DD/MM/YYYY for the booking system
function toRcmDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) throw new Error("invalid date");
  return `${m[3]}/${m[2]}/${m[1]}`;
}

// ---------- Tools ----------

const BUSINESS_INFO = {
  company: "James Blond Rentals",
  founded: 2004,
  phone: "0800 525 663",
  website: "https://www.jamesblond.co.nz",
  family_run: true,
  branches: [
    { name: "West Auckland (Henderson)", vehicles: "cars, vans, utes, trucks, minibuses" },
    { name: "Auckland Airport", vehicles: "cars, vans, utes, trucks, minibuses" },
    { name: "South Auckland", vehicles: "cars, vans, utes, trucks" },
    { name: "Mt Wellington (East Auckland)", vehicles: "cars and vans only — no trucks" },
    { name: "Hamilton", vehicles: "cars, vans, trucks" },
    { name: "Wellington CBD", vehicles: "cars, vans, utes, trucks" },
    { name: "Wellington Airport", vehicles: "cars, vans" },
    { name: "Christchurch Central", vehicles: "cars, vans, utes, trucks" },
    { name: "Christchurch Airport", vehicles: "cars, vans, utes, trucks" },
    { name: "New Plymouth Airport", vehicles: "cars, vans" },
    { name: "Palmerston North", vehicles: "cars, vans" },
  ],
  licence_rules: {
    cars_vans: "A standard full car licence (Class 1) is fine for cars, vans, utes and minibuses up to 12 seats.",
    trucks_3_tonne: "For 3-tonne trucks it depends on the specific truck — some can be driven on a car licence, others need a Class 2 licence. Confirm the allocated truck's requirement with the branch before booking.",
  },
  insurance: "Standard insurance is included with an excess. An optional excess-reduction upgrade is available at $39 per day — it is opt-in, never pre-selected.",
  pricing: {
    general: "Prices are live and demand-based for passenger vehicles; commercial vehicle rates are fixed and do not change with demand.",
    minibus: "Minibus and 12-seater rates are quoted on request, except schools: $210 per day flat rate for 12-seaters.",
    long_hire: "Discounted rates apply for hires of 21 days or more.",
  },
  payment: "Visa and Mastercard accepted. A bond or pre-authorisation may apply depending on the vehicle.",
  pre_checkin: "Customers can complete pre-check-in online before pickup to save time at the branch.",
  one_way: "One-way hires between branches are available on many routes, especially commercial vehicles — ask for a quote.",
};

async function toolCheckAvailability(p: Record<string, unknown>) {
  const branch = String(p.branch || "").trim();
  const pickupDate = String(p.pickup_date || "").trim();
  const dropoffDate = String(p.dropoff_date || "").trim();
  const pickupTime = String(p.pickup_time || "10:00").trim();
  const dropoffTime = String(p.dropoff_time || "10:00").trim();
  const vehicleType = String(p.vehicle_type || "").toLowerCase().trim();

  if (!branch || !pickupDate || !dropoffDate) {
    return { error: "branch, pickup_date and dropoff_date are required" };
  }

  const step1 = await rcmCall("step1", {});
  const locations = step1?.results?.locations || [];
  const loc = resolveLocation(locations, branch);
  if (!loc) {
    return { error: `Could not find a branch matching "${branch}". Branches: ${locations.map((l: any) => l.location).join(", ")}` };
  }

  const ages = step1?.results?.driverages || [];
  const defaultAge = ages.find((a: any) => a.isdefault) || ages.find((a: any) => Number(a.driverage) >= 25) || ages[0];
  const ageid = defaultAge?.id ?? defaultAge?.ageid;

  const step2 = await rcmCall("step2", {
    pickuplocationid: loc.id,
    pickupdate: toRcmDate(pickupDate),
    pickuptime: pickupTime,
    dropofflocationid: loc.id,
    dropoffdate: toRcmDate(dropoffDate),
    dropofftime: dropoffTime,
    ...(ageid ? { ageid } : {}),
    vehiclecategorytypeid: 0,
  });

  if (step2?.status !== "OK") {
    return { error: "Availability check failed — please offer a callback." };
  }

  const allCars: any[] = step2?.results?.availablecars || [];
  const cars: any[] = matchingVehicles(allCars, vehicleType);
  const summarise = (c: any) => {
    const km = perKmCharge(c);
    const unlimitedKm = [1, 4].includes(Number(c.vehiclecategorytypeid));
    return {
      name: c.vehiclecategory || "Vehicle",
      example: c.categoryfriendlydescription || "",
      daily_rate_nzd: Number(c.avgrate),
      total_rate_nzd: Number(c.totalrateafterdiscount) > 0 ? Number(c.totalrateafterdiscount) : null,
      days: Number(c.numberofdays) || null,
      per_km_charge_nzd: km,
      kilometres: unlimitedKm ? "unlimited" : km !== null ? `${km.toFixed(2)} NZD per km` : "no per-km charge published — confirm with the branch",
    };
  };

  const vehicles = cars.slice(0, 6).map(summarise);
  // When the requested wording matches nothing, show what IS free so the
  // assistant never tells a caller "nothing available" when similar stock exists.
  const otherAvailable = cars.length === 0 && vehicleType
    ? matchingVehicles(allCars, "").slice(0, 8).map(summarise)
    : undefined;

  return {
    branch: loc.location,
    pickup_date: pickupDate,
    dropoff_date: dropoffDate,
    vehicle_type_requested: vehicleType || null,
    vehicles_found: cars.length,
    vehicles,
    ...(otherAvailable ? { other_available_vehicles: otherAvailable } : {}),
    note: "Rates are in NZD including GST, before optional extras such as insurance upgrades. Final total is confirmed at booking. When quoting a vehicle, also mention its kilometres: the per-km charge for commercial vehicles, or that cars and minibuses include unlimited kilometres. Do NOT mention the bond unprompted — only if the caller asks about bonds, deposits or further charges; then say a refundable bond or card pre-authorisation applies, with the amount depending on the vehicle and insurance option, confirmed at booking. Trucks are listed by size, e.g. '2 Ton Box'. If vehicles_found is 0 but other_available_vehicles lists something close, offer it. If nothing suitable is listed, offer a callback.",
  };
}

async function toolRequestCallback(p: Record<string, unknown>) {
  const name = String(p.name || "").trim();
  const phone = String(p.phone || "").trim();
  const topic = String(p.topic || "General enquiry").trim();
  const preferredTime = String(p.preferred_time || "any time").trim();
  if (!name || !phone) return { error: "name and phone are required" };

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return { error: "Email service not configured" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "James Blond Rentals <info@jamesblond.co.nz>",
      to: [CALLBACK_EMAIL],
      subject: `Voice agent callback request — ${name}`,
      text: [
        `A caller asked for a callback via the phone voice agent.`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Topic: ${topic}`,
        `Preferred time: ${preferredTime}`,
        ``,
        `Please call them back.`,
      ].join("\n"),
    }),
  });
  if (!res.ok) {
    console.error("callback email failed", res.status, await res.text());
    return { error: "Could not send the callback request — please take the details manually." };
  }
  return { success: true, message: `Callback request noted for ${name} on ${phone}. The team will call back.` };
}

// ---------- Handler ----------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (!["POST", "GET"].includes(req.method)) return json({ error: "Method not allowed" }, 405);
  if (!authorized(req)) return json({ error: "Unauthorized" }, 401);

  const url = new URL(req.url);
  const tool = url.searchParams.get("tool") || "";
  let params: Record<string, unknown> = {};
  if (req.method === "GET" && tool !== "get_business_info") return json({ error: "POST required" }, 405);
  if (req.method === "POST") {
    const raw = await req.text();
    try { params = raw.trim() ? JSON.parse(raw) : {}; }
    catch { return json({ error: "Invalid JSON body" }, 400); }
  }

  try {
    switch (tool) {
      case "get_business_info":
        console.info("voice tool get_business_info succeeded");
        return json({ ...BUSINESS_INFO, current_date_nz: nzDate(), timezone: "Pacific/Auckland" });
      case "check_availability":
        return json(await toolCheckAvailability(params));
      case "request_callback":
        return json(await toolRequestCallback(params));
      default:
        return json({ error: `Unknown tool "${tool}"` }, 404);
    }
  } catch (e) {
    console.error(`tool ${tool} failed:`, e);
    return json({ error: "Tool failed — please offer the caller a callback." }, 200);
  }
});
