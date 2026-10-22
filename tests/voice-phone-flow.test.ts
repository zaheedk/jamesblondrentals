import { test, expect, mock } from "bun:test";
import { z } from "zod";

let row: any = null;
mock.module("npm:zod@3.23.8", () => ({ z }));
mock.module("npm:@supabase/supabase-js@2", () => ({ createClient: () => ({ from: () => {
  let operation = "read";
  let patch: any;
  const query: any = {
    select: () => query, eq: () => query,
    insert: (data: any) => { operation = "insert"; patch = data; return query; },
    update: (data: any) => { operation = "update"; patch = data; return query; },
    maybeSingle: async () => ({ data: row, error: null }),
    single: async () => { row = { id: "test-phone-request", ...patch }; return { data: row, error: null }; },
    then: (resolve: any) => { if (operation === "update") Object.assign(row, patch); return Promise.resolve({ error: null }).then(resolve); },
  };
  return query;
} }) }));
const { createPhoneQuote, checkPhoneBooking } = await import("../supabase/functions/voice-agent-tools/phone-booking.ts");

test("phone flow creates one quote, emails once, waits for live payment and confirms once", async () => {
  const originalFetch = globalThis.fetch;
  const originalDeno = (globalThis as any).Deno;
  (globalThis as any).Deno = { env: { get: (key: string) => key === "SUPABASE_URL" ? "https://test.invalid" : "test-only" } };
  let emails = 0;
  let writes = 0;
  let paid = false;
  globalThis.fetch = mock(async () => { emails++; return new Response(JSON.stringify({ id: `test-email-${emails}` }), { status: 200 }); }) as unknown as typeof fetch;
  const info = () => ({ reservationstatus: paid ? "Reservation" : "Reservation Request", isquotation: !paid, isonrequest: !paid, payment: paid ? 260 : 0, totalcost: 460, vehiclecategory: "2 Ton Box 16-18m3", pickupdate: "25/10/2099", dropoffdate: "27/10/2099", pickuptime: "09:00", dropofftime: "09:00" });
  const rcm = async (method: string, payload: any) => {
    if (method === "step2") return { status: "OK", results: { availablecars: [{ vehiclecategoryid: 31, vehiclecategorytypeid: 12, available: 1, avgrate: 130 }] } };
    if (method === "booking") { writes++; expect(payload.bookingtype).toBe(1); expect(payload.customer.email).toBe("zaheedk@gmail.com"); return { status: "OK", results: { reservationref: "TEST-REFERENCE", reservationno: "12345" } }; }
    if (method === "bookinginfo") return { status: "OK", results: { bookinginfo: [info()], extrafees: [{ isbondfee: true, fees: 200 }] } };
    throw new Error("Unexpected booking method");
  };
  const details = { request_id: "test-flow-quote", first_name: "Zaheed", last_name: "Test", email: "zaheedk@gmail.com", phone: "0275353037", branch: "Hamilton", pickup_date: "2099-10-25", dropoff_date: "2099-10-27", pickup_time: "09:00", dropoff_time: "09:00", vehicle_category_id: 31, driver_age_id: 8, confirmed_details: true };
  const step1 = async () => ({ results: { locations: [{ id: 17, location: "Hamilton" }], driverages: [{ id: 8, driverage: 25 }] } });
  try {
    row = null;
    expect(await createPhoneQuote(details, rcm, step1)).toMatchObject({ success: true, payment_link_sent: true, booking_confirmed: false, quote_total_nzd: 260 });
    await createPhoneQuote(details, rcm, step1);
    expect(writes).toBe(1);
    expect(emails).toBe(1);
    expect(await checkPhoneBooking({ request_id: details.request_id }, rcm)).toMatchObject({ booking_confirmed: false });
    expect(emails).toBe(1);
    paid = true;
    expect(await checkPhoneBooking({ request_id: details.request_id }, rcm)).toMatchObject({ booking_confirmed: true, payment_verified: true, confirmation_email_sent: true });
    await checkPhoneBooking({ request_id: details.request_id }, rcm);
    expect(emails).toBe(2);
  } finally {
    globalThis.fetch = originalFetch;
    (globalThis as any).Deno = originalDeno;
  }
});