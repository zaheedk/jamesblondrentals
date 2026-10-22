import { test, mock } from "bun:test";
import assert from "node:assert/strict";
import { z } from "zod";
mock.module("npm:zod@3.23.8", () => ({ z }));
const { callbackSchema, quoteSchema, verifiedBooking } = await import("../supabase/functions/voice-agent-tools/booking-policy.ts");

test("callback accepts the corrected spelled-out email", () => {
  assert.equal(callbackSchema.parse({ name: "Zaheed", phone: "0275353037", email: "zaheedk@gmail.com" }).email, "zaheedk@gmail.com");
});
test("phone quote requires confirmed first and last name, email, phone and both hire times", () => {
  const input = { request_id: "call-12345", first_name: "Zaheed", last_name: "Khan", email: "zaheedk@gmail.com", phone: "0275353037", branch: "Hamilton", pickup_date: "2026-10-25", dropoff_date: "2026-10-27", pickup_time: "09:00", dropoff_time: "09:00", vehicle_category_id: 12, driver_age_id: 4, confirmed_details: true };
  assert.equal(quoteSchema.safeParse(input).success, true);
  assert.equal(quoteSchema.safeParse({ ...input, confirmed_details: false }).success, false);
  assert.equal(quoteSchema.safeParse({ ...input, email: "bad" }).success, false);
  assert.equal(quoteSchema.safeParse({ ...input, last_name: "" }).success, false);
  assert.equal(quoteSchema.safeParse({ ...input, dropoff_time: "9am" }).success, false);
});
test("customer saying paid or a paid quote cannot confirm a booking", () => {
  assert.equal(verifiedBooking({ bookingtype: "Quote", payment: 260 }, 260), false);
  assert.equal(verifiedBooking({ bookingtype: "Booking", payment: 0 }, 260), false);
  assert.equal(verifiedBooking({ bookingtype: "Booking", payment: 260 }, 260), true);
});