import { test, expect, mock } from "bun:test";
import { z } from "zod";
import { BOOKING_DEPOSIT_NZD, pickupRentalBalance } from "../supabase/functions/_shared/voice-payment-policy.ts";
mock.module("npm:zod@3.23.8", () => ({ z }));
const { verifiedBooking } = await import("../supabase/functions/voice-agent-tools/booking-policy.ts");

test("a verified $50 deposit confirms a $510 non-quote reservation", () => {
  expect(BOOKING_DEPOSIT_NZD).toBe(50);
  expect(verifiedBooking({ reservationstatus: "Reservation", isquotation: false, isonrequest: false, payment: 50 }, 510)).toBe(true);
});
test("rental balance not paid in advance is due at pickup", () => {
  expect(pickupRentalBalance(510, 50)).toBe(460);
  expect(pickupRentalBalance(510, 510)).toBe(0);
});
test("unpaid quotes and deposit-paid quotes are not confirmed reservations", () => {
  expect(verifiedBooking({ reservationstatus: "Quotation", isquotation: true, isonrequest: false, payment: 50 }, 510)).toBe(false);
  expect(verifiedBooking({ reservationstatus: "Reservation", isquotation: false, isonrequest: false, payment: 0 }, 510)).toBe(false);
});