import { test, expect } from "bun:test";
import { checkBookingByNumber } from "../supabase/functions/voice-agent-tools/booking-lookup.ts";

const response = (overrides: Record<string, unknown> = {}) => ({
  status: "OK",
  results: {
    bookinginfo: [{
      reservationstatus: "Reservation", isquotation: false, isonrequest: false,
      payment: 260, totalcost: 260, vehiclecategory: "2 Ton Box 16-18m3",
      pickupdate: "25/10/2026", pickuptime: "09:00", pickuplocationname: "Hamilton",
      dropoffdate: "27/10/2026", dropofftime: "09:00", dropofflocationname: "Hamilton",
      ...overrides,
    }],
    customerinfo: [{ firstname: "Zahid", lastname: "Khan", email: "zahid@example.com", mobile: "0275353037", phone: "" }],
  },
});
const ask = { reservation_number: "33669", last_name: "Khan", phone: "+64 27 535 3037" };

test("verified caller gets status, vehicle, dates and amounts", async () => {
  const r: any = await checkBookingByNumber(ask, async () => response());
  expect(r.found).toBe(true);
  expect(r.vehicle).toBe("2 Ton Box 16-18m3");
  expect(r.balance_nzd).toBe(0);
});

test("personal fields never reach the model", async () => {
  const text = JSON.stringify(await checkBookingByNumber(ask, async () => response()));
  for (const s of ["Zahid", "zahid@example.com", "0275353037"]) expect(text).not.toContain(s);
});

test("a phone number that doesn't match the booking reveals nothing", async () => {
  const r: any = await checkBookingByNumber({ ...ask, phone: "021 111 2222" }, async () => response());
  expect(r.found).toBeUndefined();
  expect(JSON.stringify(r)).not.toContain("2 Ton Box");
});

test("number, surname and phone are all required", async () => {
  let called = false;
  const r: any = await checkBookingByNumber({ reservation_number: "33669" }, async () => { called = true; return response(); });
  expect(r.error).toBeTruthy();
  expect(called).toBe(false);
});

test("unpaid quotation is flagged as quote only", async () => {
  const r: any = await checkBookingByNumber(ask, async () => response({ isquotation: true, payment: 0 }));
  expect(r.is_quote_only).toBe(true);
});
