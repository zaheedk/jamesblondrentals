import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";
import { quoteSchema, verifiedBooking } from "./booking-policy.ts";
import { normaliseHireDates, nzDate, resolveLocation } from "./availability.ts";

type RcmCall = (method: string, payload: Record<string, unknown>) => Promise<any>;
const statusSchema = z.object({ request_id: z.string().min(8).max(120) });
const dateRcm = (date: string) => date.split("-").reverse().join("/");
const number = (value: unknown) => Number(value) || 0;

function dbClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Phone booking storage is not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function sendEmail(to: string, subject: string, text: string, idempotencyKey: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("Email service is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ from: "James Blond Rentals <info@jamesblond.co.nz>", to: [to], subject, text }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.id) throw new Error("Could not send the email. Do not promise delivery.");
  return String(data.id);
}

function rentalTotal(response: any) {
  const info = response?.results?.bookinginfo?.[0];
  if (!info) throw new Error("Could not read the saved quote");
  const bond = (response.results.extrafees || []).filter((f: any) => f.isbondfee === true)
    .reduce((sum: number, f: any) => sum + number(f.fees), 0);
  const total = Math.max((number(info.totalrateafterdiscount) || number(info.totalcost)) - bond, 0);
  if (!(total > 0)) throw new Error("Quote total could not be verified. Ask the team to check it.");
  return { info, total };
}

export async function createPhoneQuote(params: Record<string, unknown>, rcm: RcmCall, step1: () => Promise<any>) {
  const parsed = quoteSchema.safeParse(params);
  if (!parsed.success) return { error: "Confirm first and last name, valid email, phone, branch, exact vehicle, driver age band, both dates and HH:MM times, and permission to create the quote.", fields: parsed.error.flatten().fieldErrors };
  const p = parsed.data;
  const db = dbClient();
  const { data: existing, error: lookupError } = await db.from("voice_booking_requests").select("*").eq("request_id", p.request_id).maybeSingle();
  if (lookupError) throw new Error("Could not read phone request tracking");
  if (existing) {
    if (Object.keys(p).some((key) => key !== "email" && JSON.stringify(existing.request_data[key]) !== JSON.stringify(p[key as keyof typeof p]))) {
      return { error: "This request already exists with different details. Do not create a duplicate; ask the team to amend it." };
    }
    if (existing.request_data.email.toLowerCase() !== p.email.toLowerCase()) {
      if (!existing.reservation_reference || existing.state !== "quoted") return { error: "Email corrections through this tool apply only to an existing phone quote. Ask staff to amend a confirmed booking or review an incomplete request; do not create another quote." };
      const requestData = { ...existing.request_data, email: p.email.toLowerCase() };
      const { error: correctionError } = await db.from("voice_booking_requests").update({ request_data: requestData, quote_email_id: null }).eq("id", existing.id).eq("request_data->>email", existing.request_data.email);
      if (correctionError) throw new Error("Could not save the corrected quote email. Do not promise it was sent.");
      const { data: corrected, error: rereadError } = await db.from("voice_booking_requests").select("*").eq("id", existing.id).maybeSingle();
      if (rereadError || corrected?.request_data?.email !== requestData.email) return { error: "Another correction is being processed. Check the same request before resending; do not create a new quote." };
      Object.assign(existing, corrected);
    }
  }
  let row = existing;
  if (!row) {
    const dates = normaliseHireDates(p.pickup_date, p.dropoff_date, nzDate());
    if (!dates || dates.pickup !== p.pickup_date || dates.dropoff !== p.dropoff_date) return { error: "Confirm the corrected future dates with the customer first, then retry with those dates." };
    for (const date of [p.pickup_date, p.dropoff_date]) {
      const value = new Date(`${date}T00:00:00Z`);
      if (!Number.isFinite(value.getTime()) || value.toISOString().slice(0, 10) !== date) return { error: "Confirm valid calendar dates before creating a quote." };
    }
    if (new Date(`${p.dropoff_date}T${p.dropoff_time}:00Z`).getTime() <= new Date(`${p.pickup_date}T${p.pickup_time}:00Z`).getTime()) return { error: "Return must be after pickup." };
    const s1 = await step1();
    const pickup = resolveLocation(s1?.results?.locations || [], p.branch);
    const dropoff = resolveLocation(s1?.results?.locations || [], p.dropoff_branch || p.branch);
    if (!pickup || !dropoff) return { error: "Confirm a valid collection and return branch." };
    if (!(s1?.results?.driverages || []).some((a: any) => Number(a.id ?? a.ageid) === p.driver_age_id)) return { error: "Choose the age band returned by check_availability." };
    const hire = { pickuplocationid: pickup.id, dropofflocationid: dropoff.id, pickupdate: dateRcm(p.pickup_date), dropoffdate: dateRcm(p.dropoff_date), pickuptime: p.pickup_time, dropofftime: p.dropoff_time, ageid: p.driver_age_id, vehiclecategorytypeid: 0 };
    const availability = await rcm("step2", hire);
    if (availability?.status !== "OK") return { error: "Could not recheck availability. No quote was created." };
    const vehicle = (availability.results?.availablecars || []).find((c: any) => Number(c.vehiclecategoryid ?? c.id) === p.vehicle_category_id && Number(c.available) > 0 && number(c.avgrate) > 0);
    if (!vehicle) return { error: "The selected vehicle is no longer available. Recheck availability and ask the customer to choose again." };
    if ((Number(pickup.id) === 19 || Number(dropoff.id) === 19) && ![1, 11, 24].includes(Number(vehicle.vehiclecategorytypeid))) return { error: "Mt Wellington hires cars and vans only." };
    const { data: claimed, error: claimError } = await db.from("voice_booking_requests").insert({ request_id: p.request_id, request_data: p }).select("*").single();
    if (claimError || !claimed) return { error: "This request is already being processed. Check its status instead of creating another quote." };
    row = claimed;
    // Booking writes are never automatically retried: a timeout may still create a quote.
    // transmission is mandatory for the booking system: 0 = no preference.
    const booking = await rcm("booking", { ...hire, vehiclecategoryid: p.vehicle_category_id, vehiclecategorytypeid: vehicle.vehiclecategorytypeid, bookingtype: 1, emailoption: 0, transmission: 0, insuranceid: p.insurance_id ?? 0, extrakmsid: 0, optionalfees: (p.extra_ids || []).map((id) => ({ id, qty: 1 })), customer: { firstname: p.first_name, lastname: p.last_name, email: p.email.toLowerCase(), phone: p.phone, mobile: p.phone }, remark: `Phone quote request ${p.request_id}; details confirmed by caller.` });
    if (booking?.status !== "OK" || !booking.results?.reservationref) {
      console.error("phone quote booking write failed", JSON.stringify({
        request_id: p.request_id,
        status: booking?.status ?? null,
        error: booking?.error ?? null,
        message: booking?.message ?? null,
        result_keys: booking?.results ? Object.keys(booking.results) : null,
      }));
      // An explicit ERR response is a definite rejection (no quote exists); only unclear outcomes need staff review.
      const rejected = booking?.status === "ERR";
      await db.from("voice_booking_requests").update({ state: rejected ? "rejected" : "needs_review" }).eq("id", row.id);
      if (rejected) return { error: "The booking system rejected this quote, so no quote was created. Apologise and offer a callback; do not retry." };
      return { error: "Quote creation could not be confirmed. Do not retry with a new request; ask staff to check for an existing quote." };
    }
    const reference = String(booking.results.reservationref);
    const { error: saveError } = await db.from("voice_booking_requests").update({ reservation_reference: reference, reservation_number: String(booking.results.reservationno || ""), state: "quoted" }).eq("id", row.id);
    if (saveError) return { error: "A quote was created but tracking failed. Do not create another. Ask staff to check the phone request.", reservation_number: String(booking.results.reservationno || "") };
    row = { ...row, reservation_reference: reference, reservation_number: String(booking.results.reservationno || ""), state: "quoted" };
  }
  if (!row.reservation_reference) return { error: "This request needs staff review; do not create a second quote." };
  const { info, total } = rentalTotal(await rcm("bookinginfo", { reservationref: row.reservation_reference }));
  const paymentUrl = `https://www.jamesblond.co.nz/complete-booking/${encodeURIComponent(row.reservation_reference)}`;
  if (!row.quote_email_id) {
    const id = await sendEmail(p.email, `Your James Blond Rentals quote ${row.reservation_number}`, [
      `Hi ${p.first_name},`, "", `Here is the quote we discussed on the phone.`,
      `Reference: ${row.reservation_number}`, `Vehicle: ${info.vehiclecategory || "Your selected vehicle"}`,
      `Pickup: ${info.pickupdate} ${info.pickuptime} — ${info.pickuplocationname || p.branch}`,
      `Return: ${info.dropoffdate} ${info.dropofftime} — ${info.dropofflocationname || p.dropoff_branch || p.branch}`,
      `Rental total: NZD ${total.toFixed(2)} including GST, before any additional mileage or optional upgrades.`,
      "", `Review your quote and pay securely: ${paymentUrl}`, "", "This quote does not reserve a vehicle and availability may change before booking.",
      "Never share card details over the phone. Call 0800 525 663 for assistance.", "", "James Blond Rentals",
    ].join("\n"), `voice-quote/${row.id}/${p.email.toLowerCase()}`);
    const { error } = await db.from("voice_booking_requests").update({ quote_email_id: id, expected_amount: total }).eq("id", row.id);
    if (error) throw new Error("Email accepted but tracking could not be saved. Ask staff to check before resending.");
  }
  return { success: true, request_id: p.request_id, reservation_number: row.reservation_number, quote_total_nzd: total, payment_link_sent: true, email: p.email, booking_confirmed: false, booking_customer_email_updated: false, instruction: "The existing quote and secure payment link were accepted for sending to the confirmed email, not proof of inbox delivery or booking confirmation. If reading the address aloud, spell the local part and say at for @ and dot for each period. The booking system customer email was not edited; ask staff to correct that separately if required. Ask the caller to pay using the link, then call check_phone_booking. Never collect card details." };
}

export async function checkPhoneBooking(params: Record<string, unknown>, rcm: RcmCall) {
  const parsed = statusSchema.safeParse(params);
  if (!parsed.success) return { error: "The same request_id used to create this phone quote is required." };
  const db = dbClient();
  const { data: row, error } = await db.from("voice_booking_requests").select("*").eq("request_id", parsed.data.request_id).maybeSingle();
  if (error || !row?.reservation_reference) return { error: "No completed quote is tracked for this phone request. Ask staff to check it." };
  const response = await rcm("bookinginfo", { reservationref: row.reservation_reference });
  if (response?.status !== "OK") return { error: "Unable to verify the booking. Never claim payment or booking success." };
  const { info, total } = rentalTotal(response);
  if (!verifiedBooking(info, total)) return { booking_confirmed: false, reservation_number: row.reservation_number, instruction: "Payment and confirmed booking have not both been verified. Ask the customer to finish the secure checkout and try again. If they have already paid, ask staff to reconcile it; never ask them to pay again." };
  if (!row.confirmation_email_id) {
    const p = row.request_data;
    const emailId = await sendEmail(p.email, `James Blond Rentals booking confirmation ${row.reservation_number}`, [
      `Hi ${p.first_name},`, "", `Your booking ${row.reservation_number} is confirmed and payment has been verified.`,
      `Vehicle: ${info.vehiclecategory || "Your selected vehicle"}`,
      `Pickup: ${info.pickupdate} ${info.pickuptime} — ${info.pickuplocationname || p.branch}`,
      `Return: ${info.dropoffdate} ${info.dropofftime} — ${info.dropofflocationname || p.dropoff_branch || p.branch}`,
      "", "Complete your personal and licence details before pickup: https://www.jamesblond.co.nz/login", "Call 0800 525 663 for assistance.", "", "James Blond Rentals",
    ].join("\n"), `voice-confirmation/${row.id}`);
    const { error: saveError } = await db.from("voice_booking_requests").update({ state: "confirmed", confirmation_email_id: emailId }).eq("id", row.id);
    if (saveError) throw new Error("Booking is confirmed but confirmation email tracking needs staff review.");
  }
  return { booking_confirmed: true, payment_verified: true, confirmation_email_sent: true, reservation_number: row.reservation_number };
}