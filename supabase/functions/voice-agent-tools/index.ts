// James Blond Rentals — voice agent tools.
// Webhook endpoints called by the ElevenLabs phone agent during a call.
// Auth: header x-voice-agent-key must match VOICE_AGENT_TOOLS_SECRET
// (configured on the agent by voice-agent-admin), or x-admin-key must
// match ELEVENLABS_API_KEY (admin/testing only).
import { corsHeaders } from "./cors.ts";
import { matchingVehicles, normaliseHireDates, nzDate, perKmCharge, resolveLocation } from "./availability.ts";
import { callbackSchema } from "./booking-policy.ts";
import { createPhoneQuote, checkPhoneBooking } from "./phone-booking.ts";

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

// The booking system's edge occasionally returns transient 5xx (e.g. 520)
// or drops the connection; a single blip must not end a caller's quote.
const RETRYABLE = new Set([429, 500, 502, 503, 504, 520, 521, 522, 523, 524]);
const MAX_ATTEMPTS = 4;

async function rcmCall(method: string, payload: Record<string, unknown>): Promise<any> {
  const body = JSON.stringify({ method, ...payload });
  const signature = await hmacHex(RCM_API_SECRET, body);
  let lastError = "no response";
  const maxAttempts = method === "booking" || method === "confirmpayment" ? 1 : MAX_ATTEMPTS;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 700 * attempt));
    try {
      const res = await fetch(`${RCM_API_URL}?apikey=${RCM_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", signature },
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return await res.json();
      lastError = String(res.status);
      await res.body?.cancel();
      if (!RETRYABLE.has(res.status)) break;
      console.warn(`RCM ${method} returned ${res.status}, attempt ${attempt + 1}/${MAX_ATTEMPTS}`);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      console.warn(`RCM ${method} request failed (${lastError}), attempt ${attempt + 1}/${MAX_ATTEMPTS}`);
    }
  }
  throw new Error(`Booking system error (${lastError})`);
}

// Branch list and driver ages change rarely; caching them halves the
// booking-system calls per quote and the chance of hitting a transient error.
let step1Cache: { at: number; data: any } | null = null;
async function getStep1(): Promise<any> {
  if (step1Cache && Date.now() - step1Cache.at < 15 * 60_000) return step1Cache.data;
  const data = await rcmCall("step1", {});
  if (data?.status === "OK" || data?.results?.locations?.length) step1Cache = { at: Date.now(), data };
  return data;
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
  const rawPickup = String(p.pickup_date || "").trim();
  const rawDropoff = String(p.dropoff_date || "").trim();
  const pickupTime = String(p.pickup_time || "10:00").trim();
  const dropoffTime = String(p.dropoff_time || "10:00").trim();
  const vehicleType = String(p.vehicle_type || "").toLowerCase().trim();
  const driverAgeId = p.driver_age_id === undefined ? undefined : Number(p.driver_age_id);

  if (!branch || !rawPickup || !rawDropoff) {
    return { error: "branch, pickup_date and dropoff_date are required" };
  }

  const today = nzDate();
  const dates = normaliseHireDates(rawPickup, rawDropoff, today);
  if (!dates) {
    return { error: `Dates must be YYYY-MM-DD. Today in New Zealand is ${today}. Retry with corrected dates.` };
  }
  const pickupDate = dates.pickup;
  const dropoffDate = dates.dropoff;
  const datesCorrected = pickupDate !== rawPickup || dropoffDate !== rawDropoff;

  const step1 = await getStep1();
  const locations = step1?.results?.locations || [];
  const loc = resolveLocation(locations, branch);
  if (!loc) {
    return { error: `Could not find a branch matching "${branch}". Branches: ${locations.map((l: any) => l.location).join(", ")}` };
  }

  const ages = step1?.results?.driverages || [];
  const defaultAge = ages.find((a: any) => a.isdefault) || ages.find((a: any) => Number(a.driverage) >= 25) || ages[0];
  const chosenAge = driverAgeId === undefined ? defaultAge : ages.find((a: any) => Number(a.id ?? a.ageid) === driverAgeId);
  if (!chosenAge) return { error: "Select a valid driver_age_id from driver_age_options." };
  const ageid = chosenAge?.id ?? chosenAge?.ageid;

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
    console.error("check_availability step2 failed", JSON.stringify({ branch: loc.id, pickupDate, dropoffDate, pickupTime, dropoffTime, status: step2?.status, error: step2?.error }));
    return { error: `Availability check failed (${step2?.error || "booking system error"}) for ${pickupDate} to ${dropoffDate}. Please offer a callback.` };
  }

  const allCars: any[] = step2?.results?.availablecars || [];
  const cars: any[] = matchingVehicles(allCars, vehicleType);
  const summarise = (c: any) => {
    const km = perKmCharge(c);
    const unlimitedKm = [1, 4].includes(Number(c.vehiclecategorytypeid));
    return {
      name: c.vehiclecategory || "Vehicle",
      vehicle_category_id: Number(c.vehiclecategoryid ?? c.id),
      vehicle_category_type_id: Number(c.vehiclecategorytypeid),
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
    driver_age_id_used: Number(ageid),
    driver_age_options: ages.map((a: any) => ({ id: Number(a.id ?? a.ageid), label: String(a.driverage ?? a.description ?? a.age ?? "") })),
    pickup_date: pickupDate,
    dropoff_date: dropoffDate,
    ...(datesCorrected ? { dates_corrected_note: `Dates were adjusted to the upcoming ${pickupDate} to ${dropoffDate} (today in NZ is ${today}). Confirm these dates with the caller.` } : {}),
    vehicle_type_requested: vehicleType || null,
    vehicles_found: cars.length,
    vehicles,
    ...(otherAvailable ? { other_available_vehicles: otherAvailable } : {}),
    note: "Rates are in NZD including GST, before optional extras such as insurance upgrades. Final total is confirmed at booking. When quoting a vehicle, also mention its kilometres: the per-km charge for commercial vehicles, or that cars and minibuses include unlimited kilometres. Do NOT mention the bond unprompted — only if the caller asks about bonds, deposits or further charges; then say a refundable bond or card pre-authorisation applies, with the amount depending on the vehicle and insurance option, confirmed at booking. Trucks are listed by size, e.g. '2 Ton Box'. If vehicles_found is 0 but other_available_vehicles lists something close, offer it. If nothing suitable is listed, offer a callback.",
  };
}

// Look up any existing booking by its 5-digit reservation number, whatever
// channel it was made through (website, staff, phone quote). Only safe,
// non-personal fields are returned to the model — never names, contact
// details, licence data or card information.
async function toolCheckBooking(p: Record<string, unknown>) {
  const reservationNo = String(p.reservation_number || "").trim();
  if (!/^\d{4,7}$/.test(reservationNo)) {
    return { error: "Ask the caller for the 5-digit booking number from their confirmation email, then retry." };
  }
  const response = await rcmCall("bookinginfo", { reservationno: reservationNo });
  if (response?.status !== "OK" || !response?.results?.bookinginfo?.length) {
    return { error: `No booking found for number ${reservationNo}. Ask the caller to double-check the number from their confirmation email; if it still fails, offer a callback.` };
  }
  const info = response.results.bookinginfo[0];
  const status = String(info.reservationstatus || "unknown");
  const paid = number(info.payment);
  const total = number(info.totalrateafterdiscount) || number(info.totalcost);
  const isQuote = info.isquotation === true || info.isonrequest === true;
  return {
    found: true,
    reservation_number: reservationNo,
    status,
    is_quote_only: isQuote,
    vehicle: info.vehiclecategory || "Vehicle",
    pickup: { date: info.pickupdate, time: info.pickuptime, branch: info.pickuplocationname },
    dropoff: { date: info.dropoffdate, time: info.dropofftime, branch: info.dropofflocationname },
    total_nzd: total > 0 ? total : null,
    amount_paid_nzd: paid > 0 ? paid : 0,
    balance_nzd: total > 0 ? Math.max(total - paid, 0) : null,
    note: "Share only these details with the caller: status, vehicle, pickup and return date/time/branch, and amounts. If the caller wants to change or cancel the booking, or asks about anything not listed here (names, contact details, licence, payment method), take a callback request — you cannot see or change those. If is_quote_only is true, it is an unpaid quote, not a confirmed booking.",
  };
}

async function toolRequestCallback(p: Record<string, unknown>) {
  const parsed = callbackSchema.safeParse(p);
  if (!parsed.success) return { error: "Please confirm the name, phone number and a valid email if supplied." };
  const { name, phone, email, topic, preferred_time: preferredTime } = parsed.data;

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
        ...(email ? [`Email: ${email}`] : []),
        `Topic: ${topic}`,
        `Preferred time: ${preferredTime}`,
        ``,
        `Please call them back.`,
      ].join("\n"),
    }),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok || !result?.id) {
    console.error("callback email failed", res.status);
    return { error: "Could not send the callback request — please take the details manually." };
  }
  return { success: true, email_recorded: Boolean(email), message: `Callback request noted for ${name} on ${phone}${email ? `, email ${email}` : ""}. The team will call back.` };
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
      case "create_phone_quote":
        return json(await createPhoneQuote(params, rcmCall, getStep1));
      case "check_phone_booking":
        return json(await checkPhoneBooking(params, rcmCall));
      case "check_booking":
        return json(await toolCheckBooking(params));
      default:
        return json({ error: `Unknown tool "${tool}"` }, 404);
    }
  } catch (e) {
    console.error(`tool ${tool} failed:`, e);
    const transient = tool === "check_availability" && e instanceof Error && e.message.startsWith("Booking system error");
    return json({
      error: transient
        ? "The booking system had a temporary connection problem. Tell the caller you'll try once more, then call check_availability again with the same details. If it fails a second time, offer a callback."
        : "Tool failed — please offer the caller a callback.",
    }, 200);
  }
});
