import { describe, it, expect } from "bun:test";
import { isSundayBlockedDate, disablePastDates, SUNDAY_CLOSED_LOCATION_IDS } from "../src/components/home/form-components/DateTimeUtils";
import { sundayClosureError, isSundayIso, isSundayClosedBranch } from "../supabase/functions/voice-agent-tools/availability";

// Wellington CBD is RCM location 11 and takes no Sunday pickups or drop-offs.
const WELLINGTON_CBD = { id: 11, location: "Wellington CBD" };
const WEST_AUCKLAND = { id: 1, location: "West Auckland" };
// Known Sundays and weekdays (verified against the calendar)
const SUNDAY = "2026-11-22";
const MONDAY = "2026-11-23";

describe("website date pickers block Sundays at Wellington CBD", () => {
  it("flags Wellington CBD (location 11) as Sunday-closed", () => {
    expect(SUNDAY_CLOSED_LOCATION_IDS.has("11")).toBe(true);
  });
  it("blocks a Sunday at Wellington CBD but not the Monday after", () => {
    expect(isSundayBlockedDate("11", new Date(`${SUNDAY}T12:00:00`))).toBe(true);
    expect(isSundayBlockedDate("11", new Date(`${MONDAY}T12:00:00`))).toBe(false);
  });
  it("does not block Sundays at other branches", () => {
    expect(isSundayBlockedDate("1", new Date(`${SUNDAY}T12:00:00`))).toBe(false);
    expect(isSundayBlockedDate(undefined, new Date(`${SUNDAY}T12:00:00`))).toBe(false);
  });
  it("disablePastDates rejects a future Sunday at Wellington CBD", () => {
    expect(disablePastDates(new Date(`${SUNDAY}T12:00:00`), "11", [])).toBe(true);
    expect(disablePastDates(new Date(`${MONDAY}T12:00:00`), "11", [])).toBe(false);
  });
});

describe("voice agent Sunday closure for Wellington CBD", () => {
  it("detects Sundays from ISO dates", () => {
    expect(isSundayIso(SUNDAY)).toBe(true);
    expect(isSundayIso(MONDAY)).toBe(false);
  });
  it("only Wellington CBD is Sunday-closed", () => {
    expect(isSundayClosedBranch(WELLINGTON_CBD)).toBe(true);
    expect(isSundayClosedBranch(WEST_AUCKLAND)).toBe(false);
  });
  it("rejects a Sunday pickup at Wellington CBD", () => {
    const error = sundayClosureError(WELLINGTON_CBD, SUNDAY, MONDAY);
    expect(error).toContain("closed on Sundays");
    expect(error).toContain("pickup date is");
  });
  it("rejects a Sunday return at Wellington CBD", () => {
    const error = sundayClosureError(WELLINGTON_CBD, MONDAY, "2026-11-29");
    expect(error).toContain("return date is");
  });
  it("allows weekday hires at Wellington CBD and any hire at other branches", () => {
    expect(sundayClosureError(WELLINGTON_CBD, MONDAY, "2026-11-24")).toBeNull();
    expect(sundayClosureError(WEST_AUCKLAND, SUNDAY, MONDAY)).toBeNull();
  });
});
