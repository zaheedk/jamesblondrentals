import { test, expect } from "bun:test";
import { checkBookingByNumber } from "../supabase/functions/voice-agent-tools/booking-lookup.ts";

const bookingInfo = (overrides: Record<string, unknown> = {}) => ({
  status: "OK",
  results: {
    bookinginfo: [{
      reservationstatus: "Reservation",
      isquotation: false,
      isonrequest: false,
      payment: 260,
      totalrateafterdiscount: 260,
      vehiclecategory: "2 Ton Box 16-18m3",
      pickupdate: "25/10/2026",
      pickuptime: "09:00",
      pickuplocationname: "Hamilton",
      dropoffdate: "27/10/2026",
      dropofftime: "09:00",
      dropofflocationname: "Hamilton",
      // Personal fields that must never reach the model:
      firstname: "Zahid",
      lastname: "Khan",
      email: "zahid@example.com",
      phone: "0275353037",
      ...overrides,
    }],
  },
});

test("booking lookup returns status, vehicle, dates and amounts for a confirmed booking", async () => {
  const rcm = async (method: string, payload: any) => {
    expect(method).toBe("bookinginfo");
    expect(payload).toEqual({ reservationno: "33669" });
    return bookingInfo();
  };
  const result = await checkBookingByNumber({ reservation_number: "33669" }, rcm);
  expect(result).toMatchObject({
    found: true,
    reservation_number: "33669",
    status: "Reservation",
    is_quote_only: false,
    vehicle: "2 Ton Box 16-18m3",
    total_nzd: 260,
    amount_paid_nzd: 260,
    balance_nzd: 0,
  });
});

test("booking lookup never exposes personal details to the model", async () => {
  const rcm = async () => bookingInfo();
  const result = await checkBookingByNumber({ reservation_number: "33669" }, rcm);
  const serialised = JSON.stringify(result);
  expect(serialised).not.toContain("Zahid");
  expect(serialised).not.toContain("Khan");
  expect(serialised).not.toContain("zahid@example.com");
  expect(serialised).not.toContain("0275353037");
});

test("booking lookup flags an unpaid quote as not a confirmed booking", async () => {
  const rcm = async () => bookingInfo({ reservationstatus: "Quotation", isquotation: true, payment: 0 });
  const result = await checkBookingByNumber({ reservation_number: "33669" }, rcm);
  expect(result).toMatchObject({ found: true, is_quote_only: true, amount_paid_nzd: 0 });
});

test("booking lookup rejects missing or malformed numbers without calling the booking system", async () => {
  let calls = 0;
  const rcm = async () => { calls++; return bookingInfo(); };
  for (const bad of ["", "abc", "33 669", "3366912345"]) {
    const result = await checkBookingByNumber({ reservation_number: bad }, rcm);
    expect(result.error).toBeTruthy();
  }
  expect(calls).toBe(0);
});

test("booking lookup reports a clear not-found error", async () => {
  const rcm = async () => ({ status: "OK", results: { bookinginfo: [] } });
  const result = await checkBookingByNumber({ reservation_number: "99999" }, rcm);
  expect(result.error).toContain("99999");
});
