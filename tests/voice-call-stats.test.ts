import { test, expect } from "bun:test";
import { classifyCall, nzDay } from "../supabase/functions/voice-call-stats/classify.ts";

test("a caller who hangs up after the greeting is dropped", () => {
  expect(classifyCall({ message_count: 1, call_duration_secs: 9, tool_names: [] })).toBe("dropped");
});

test("a conversation that ends without finishing a task is partial", () => {
  expect(classifyCall({ message_count: 35, call_duration_secs: 195, tool_names: ["get_business_info", "check_availability"] })).toBe("partial");
  expect(classifyCall({ message_count: 3, call_duration_secs: 24, tool_names: [] })).toBe("partial");
});

test("a submitted change request counts as completed", () => {
  expect(classifyCall({ message_count: 21, call_duration_secs: 109, tool_names: ["get_business_info", "request_booking_change"] })).toBe("completed");
});

test("calls are grouped by New Zealand date", () => {
  expect(nzDay(Date.parse("2026-10-27T22:10:15Z") / 1000)).toBe("2026-10-28");
});

import { callerPhone } from "../supabase/functions/voice-call-stats/classify.ts";

test("our own trunk number is not shown as the caller's number", () => {
  expect(callerPhone("098134134", []).phone).toBeNull();
});

test("a number the caller gave Sarah is used when caller ID is hidden", () => {
  expect(callerPhone("098134134", ['{"phone":"021367775"}'])).toEqual({ phone: "021367775", source: "given" });
});

test("a real caller ID is preferred", () => {
  expect(callerPhone("0275353037", ['{"phone":"021367775"}'])).toEqual({ phone: "0275353037", source: "caller_id" });
});
