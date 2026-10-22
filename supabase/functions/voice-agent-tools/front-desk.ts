// Front-desk capabilities for the phone assistant: caller verification,
// quote extras/insurance, resending booking links, change requests and
// breakdown reports. Existing bookings cannot be edited through the booking
// API we hold, so changes are verified, priced where possible and handed to
// staff — the assistant never claims a change is made.
import { z } from "npm:zod@3.23.8";
import { normaliseHireDates, nzDate, resolveLocation } from "./availability.ts";

type RcmCall = (method: string, payload: Record<string, unknown>) => Promise<any>;
export type Mailer = (to: string, subject: string, text: string, key: string) => Promise<string>;
export type Texter = (to: string, message: string) => Promise<string>;

export const STAFF_EMAIL = "zaheed@jamesblond.co.nz";
export const BREAKDOWN_SMS_TO = "+64275353037";
const SITE = "https://www.jamesblond.co.nz";
const num = (v: unknown) => Number(v) || 0;
const dateRcm = (d: string) => d.split("-").reverse().join("/");

/** NZ numbers compared on the national significant number (drops +64 / leading 0). */
export function samePhone(a: unknown, b: unknown): boolean {
  const norm = (v: unknown) => {
    let d = String(v || "").replace(/\D/g, "");
    if (d.startsWith("64")) d = d.slice(2);
    return d.replace(/^0+/, "");
  };
  const x = norm(a), y = norm(b);
  return x.length >= 7 && x === y;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "the email on the booking";
  return `${local.slice(0, 1)}${"*".repeat(Math.max(local.length - 1, 2))}@${domain}`;
}

const identitySchema = z.object({
  reservation_number: z.string().trim().regex(/^\d{4,7}$/),
  last_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(/^\+?[\d ()-]{7,25}$/),
});

/** Number + surname + phone must all match the booking before anything is shared or requested. */
export async function verifyCaller(p: Record<string, unknown>, rcm: RcmCall) {
  const parsed = identitySchema.safeParse(p);
  if (!parsed.success) return { error: "Ask for the 5-digit booking number, the last name on the booking and the phone number on the booking, then retry." } as const;
  const { reservation_number, last_name, phone } = parsed.data;
  const res = await rcm("bookinginfo", { reservationno: reservation_number, lastname: last_name });
  const info = res?.results?.bookinginfo?.[0];
  const customer = res?.results?.customerinfo?.[0];
  if (res?.status !== "OK" || !info || !customer) {
    return { error: "Those details do not match a booking. Ask the caller to check the number and last name from their confirmation email; after one more failed attempt, offer a callback. Do not share any booking details." } as const;
  }
  if (!samePhone(phone, customer.mobile) && !samePhone(phone, customer.phone)) {
    return { error: "The phone number does not match the one on this booking, so you cannot discuss or change it. Do not reveal any booking details or hint at the correct number. Offer a callback instead." } as const;
  }
  return { ok: true as const, reservation_number, info, customer, results: res.results };
}

// ---------- Quote options (insurance + extras) ----------

const optionsSchema = z.object({
  branch: z.string().trim().min(1),
  dropoff_branch: z.string().trim().min(1).optional(),
  pickup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dropoff_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickup_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  dropoff_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  vehicle_category_id: z.coerce.number().int().positive(),
  driver_age_id: z.coerce.number().int().positive(),
});

// Payment-method rows (deposit/full payment) are checkout mechanics, not extras.
const isRealExtra = (f: any) => num(f.fees ?? f.totalfeeamount) > 0 && !/deposit|full\s*payment|fullpayment/i.test(String(f.name));

export async function getQuoteOptions(p: Record<string, unknown>, rcm: RcmCall, step1: () => Promise<any>) {
  const parsed = optionsSchema.safeParse(p);
  if (!parsed.success) return { error: "Need branch, dates, HH:MM times, vehicle_category_id and driver_age_id from check_availability." };
  const o = parsed.data;
  const s1 = await step1();
  const pickup = resolveLocation(s1?.results?.locations || [], o.branch);
  const dropoff = resolveLocation(s1?.results?.locations || [], o.dropoff_branch || o.branch);
  if (!pickup || !dropoff) return { error: "Confirm a valid collection and return branch." };
  const res = await rcm("step3", {
    pickuplocationid: pickup.id, dropofflocationid: dropoff.id,
    pickupdate: dateRcm(o.pickup_date), dropoffdate: dateRcm(o.dropoff_date),
    pickuptime: o.pickup_time, dropofftime: o.dropoff_time,
    ageid: o.driver_age_id, vehiclecategorytypeid: 0, vehiclecategoryid: o.vehicle_category_id,
  });
  if (res?.status !== "OK") return { error: "Could not load insurance and extras right now. You can still create the quote with standard insurance; the customer can add options in secure checkout." };
  const insurance = (res.results?.insuranceoptions || []).map((i: any) => ({
    insurance_id: Number(i.id), name: String(i.name), per_day_nzd: num(i.fees), total_nzd: num(i.totalinsuranceamount),
  })).sort((a: any, b: any) => a.total_nzd - b.total_nzd);
  const extras = (res.results?.optionalfees || []).filter(isRealExtra).map((f: any) => ({
    extra_id: Number(f.id), name: String(f.name), total_nzd: num(f.totalfeeamount ?? f.fees),
  }));
  return {
    insurance_options: insurance,
    extras,
    note: "Read the insurance options plainly, cheapest first, including each excess. The lowest-cost option is the standard cover; any upgrade is the caller's choice — never pre-select or push one. Only pass insurance_id / extra_ids to create_phone_quote for options the caller explicitly chose.",
  };
}

// ---------- Resend links ----------

export async function resendBookingLinks(p: Record<string, unknown>, rcm: RcmCall, mail: Mailer) {
  const v = await verifyCaller(p, rcm);
  if (!("ok" in v)) return v;
  const email = String(v.customer.email || "").trim();
  if (!z.string().email().safeParse(email).success) return { error: "There is no valid email on this booking. Offer a callback so staff can update it." };
  const info = v.info;
  const total = num(info.totalcost);
  const balance = Math.max(num(info.balancedue), 0);
  const isQuote = info.isquotation === true;
  const lines = [
    `Hi ${v.customer.firstname || "there"},`, "",
    `As requested on the phone, here are the links for booking ${v.reservation_number}.`,
    `Vehicle: ${info.vehiclecategory || "Your vehicle"}`,
    `Pickup: ${info.pickupdate} ${info.pickuptime} — ${info.pickuplocationname || ""}`,
    `Return: ${info.dropoffdate} ${info.dropofftime} — ${info.dropofflocationname || ""}`,
    "",
    ...(isQuote || balance > 0
      ? [`${isQuote ? "Review and confirm your quote" : `Pay the balance of NZD ${balance.toFixed(2)}`} securely: ${SITE}/complete-booking/${encodeURIComponent(String(info.reservationref))}`, ""]
      : total > 0 ? ["Your booking is paid in full.", ""] : []),
    `Pre-check-in before pickup to save time at the branch: ${SITE}/online-check-in`,
    `Manage your booking, licence and driver details: ${SITE}/login`,
    "", "Call 0800 525 663 for assistance.", "", "James Blond Rentals",
  ];
  const minute = new Date().toISOString().slice(0, 16);
  await mail(email, `Your James Blond Rentals booking ${v.reservation_number}`, lines.join("\n"), `voice-resend/${v.reservation_number}/${minute}`);
  return { success: true, sent_to: maskEmail(email), included_payment_link: isQuote || balance > 0, instruction: "Say the links were emailed to the address on the booking (read the masked address, e.g. 'starting with z at gmail'). Never send to a different address; if they need a new email address on file, take a callback." };
}

// ---------- Change requests (dates, times, vehicle, extras, insurance) ----------

const changeSchema = z.object({
  new_pickup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  new_dropoff_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  new_pickup_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  new_dropoff_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  new_vehicle_category_id: z.coerce.number().int().positive().optional(),
  extras_or_insurance: z.string().trim().max(500).optional(),
  details: z.string().trim().min(3).max(1500),
});

export async function requestBookingChange(p: Record<string, unknown>, rcm: RcmCall, mail: Mailer) {
  const v = await verifyCaller(p, rcm);
  if (!("ok" in v)) return v;
  const parsed = changeSchema.safeParse(p);
  if (!parsed.success) return { error: "Describe the requested change in details; use YYYY-MM-DD dates and HH:MM times." };
  const c = parsed.data;
  const info = v.info;
  if (info.isclosed === true || /returned|cancel/i.test(String(info.reservationstatus))) {
    return { error: "This booking is closed or cancelled and cannot be changed. Offer to help with a new quote instead." };
  }
  const toIso = (d: string) => { const t = new Date(`${d} 12:00 UTC`); return Number.isFinite(t.getTime()) ? t.toISOString().slice(0, 10) : ""; };
  const pickupDate = c.new_pickup_date || toIso(String(info.pickupdate));
  const dropoffDate = c.new_dropoff_date || toIso(String(info.dropoffdate));
  const pickupTime = c.new_pickup_time || String(info.pickuptime);
  const dropoffTime = c.new_dropoff_time || String(info.dropofftime);
  const categoryId = c.new_vehicle_category_id || Number(info.vehiclecategoryid);
  const hireChanged = Boolean(c.new_pickup_date || c.new_dropoff_date || c.new_pickup_time || c.new_dropoff_time || c.new_vehicle_category_id);

  let check: { available: boolean; estimate_total_nzd: number | null; vehicle: string } | null = null;
  if (hireChanged) {
    const dates = normaliseHireDates(pickupDate, dropoffDate, nzDate());
    if (!dates || dates.pickup !== pickupDate || dates.dropoff !== dropoffDate) return { error: "Confirm the new dates are upcoming and the return is after pickup, then retry." };
    const s2 = await rcm("step2", {
      pickuplocationid: info.pickuplocationid, dropofflocationid: info.dropofflocationid,
      pickupdate: dateRcm(pickupDate), dropoffdate: dateRcm(dropoffDate), pickuptime: pickupTime, dropofftime: dropoffTime,
      ageid: info.driverageid, vehiclecategorytypeid: 0,
    }).catch(() => null);
    if (s2?.status === "OK") {
      const car = (s2.results?.availablecars || []).find((x: any) => Number(x.vehiclecategoryid ?? x.id) === categoryId);
      check = { available: Boolean(car && Number(car.available) > 0), estimate_total_nzd: car ? num(car.totalrateafterdiscount) || null : null, vehicle: car?.vehiclecategory || String(info.vehiclecategory) };
    }
  }
  const summary = [
    `Verified caller (booking number, surname and phone matched) requested a change by phone.`, "",
    `Booking: ${v.reservation_number} (${info.reservationstatus})`,
    `Customer: ${v.customer.firstname} ${v.customer.lastname}, ${v.customer.mobile || v.customer.phone}, ${v.customer.email}`,
    `Current: ${info.vehiclecategory}, ${info.pickupdate} ${info.pickuptime} → ${info.dropoffdate} ${info.dropofftime}, ${info.pickuplocationname}; total NZD ${num(info.totalcost).toFixed(2)}, paid NZD ${num(info.payment).toFixed(2)}`,
    ...(hireChanged ? [`Requested: category ${categoryId}, ${pickupDate} ${pickupTime} → ${dropoffDate} ${dropoffTime}`] : []),
    ...(c.extras_or_insurance ? [`Extras/insurance: ${c.extras_or_insurance}`] : []),
    ...(check ? [`Live check: ${check.available ? "AVAILABLE" : "NOT available"}${check.estimate_total_nzd ? `, new rental estimate NZD ${check.estimate_total_nzd.toFixed(2)} before extras` : ""}`] : hireChanged ? ["Live check: could not be completed"] : []),
    `Caller's words: ${c.details}`, "",
    "Please make the change in the booking system and confirm with the customer.",
  ].join("\n");
  await mail(STAFF_EMAIL, `Booking change request — ${v.reservation_number}`, summary, `voice-change/${v.reservation_number}/${new Date().toISOString().slice(0, 16)}`);
  return {
    success: true,
    change_made: false,
    availability: check ? (check.available ? "available" : "not_available") : hireChanged ? "unknown" : "not_checked",
    new_rental_estimate_nzd: check?.estimate_total_nzd ?? null,
    current_total_nzd: num(info.totalcost) || null,
    instruction: "Tell the caller their change request has been sent to the team, who will update the booking and confirm by phone or email. It is NOT changed yet. If availability is not_available, say so and offer other dates or vehicles. Any price given is an estimate before extras; the team confirms the final difference.",
  };
}

// ---------- Breakdown / accident reports ----------

const breakdownSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(/^\+?[\d ()-]{7,25}$/),
  location: z.string().trim().min(2).max(500),
  description: z.string().trim().min(2).max(1500),
  reservation_number: z.string().trim().max(10).optional(),
  registration: z.string().trim().max(12).optional(),
  is_safe: z.boolean(),
  anyone_injured: z.boolean().default(false),
  vehicle_drivable: z.boolean().optional(),
});

export function toNzMobile(phone: string): string | null {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("64")) d = d.slice(2);
  d = d.replace(/^0+/, "");
  return /^2\d{7,9}$/.test(d) ? `+64${d}` : null;
}

export async function reportBreakdown(p: Record<string, unknown>, mail: Mailer, text?: Texter) {
  const parsed = breakdownSchema.safeParse(p);
  if (!parsed.success) return { error: "Confirm the caller's name, contact number, exact location, what happened and whether they are safe." };
  const b = parsed.data;
  const ref = b.reservation_number || b.registration || "unknown";
  const body = [
    `URGENT — breakdown/incident reported to the phone assistant.`, "",
    `Name: ${b.name}`, `Phone: ${b.phone}`, `Booking: ${b.reservation_number || "not given"}`, `Rego: ${b.registration || "not given"}`,
    `Location: ${b.location}`, `What happened: ${b.description}`,
    `Safe: ${b.is_safe ? "yes" : "NO"}`, `Injuries: ${b.anyone_injured ? "YES" : "no"}`,
    `Drivable: ${b.vehicle_drivable === undefined ? "unknown" : b.vehicle_drivable ? "yes" : "no"}`, "",
    `Call the customer back as soon as possible.`,
  ].join("\n");
  await mail(STAFF_EMAIL, `URGENT breakdown — ${b.name} (${ref})`, body, `voice-breakdown/${ref}/${new Date().toISOString().slice(0, 16)}`);
  let texted = false;
  if (text) {
    try {
      await text(BREAKDOWN_SMS_TO, `James Blond Rentals\nURGENT breakdown: ${b.name} ${b.phone}, ${ref}. ${b.location}. ${b.description}`.slice(0, 450));
      texted = true;
    } catch (e) { console.error("breakdown sms failed", e instanceof Error ? e.message : e); }
  }
  return {
    success: true, staff_emailed: true, staff_texted: texted,
    instruction: "Tell the caller the team has been alerted urgently and will call them back on the number given. If anyone is hurt or in danger, they must call 111 first. Advise them to stay safe, keep hazard lights on and not attempt repairs. Do not promise a tow, replacement vehicle or arrival time.",
  };
}
