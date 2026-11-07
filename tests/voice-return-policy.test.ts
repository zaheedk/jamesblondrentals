import { test, expect } from "bun:test";
import { RETURN_POLICY } from "../supabase/functions/voice-agent-tools/return-policy.ts";

test("city branches do not offer after-hours drop-off", () => {
  expect(RETURN_POLICY.city_after_hours_dropoff).toBe(false);
});

test("airport locations offer after-hours drop-off for non-commercial vehicles", () => {
  expect(RETURN_POLICY.airport_after_hours_dropoff).toBe(true);
});

test("commercial vehicles cannot be returned after hours", () => {
  expect(RETURN_POLICY.commercial_after_hours_dropoff).toBe(false);
});

test("commercial vehicle returns are city-only", () => {
  expect(RETURN_POLICY.commercial_return_locations).toBe("city_only");
});