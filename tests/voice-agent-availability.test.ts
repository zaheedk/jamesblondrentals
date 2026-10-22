import { describe, it, expect } from "bun:test";
import { resolveLocation, matchingVehicles, nzDate } from "../supabase/functions/voice-agent-tools/availability";

describe("voice enquiry location and availability", () => {
  const branches = [
    { id: 19, location: "Mt Wellington" },
    { id: 13, location: "Wellington Airport" },
    { id: 11, location: "Wellington CBD" },
    { id: 17, location: "Hamilton" },
    { id: 16, location: "Christchurch Central" },
  ];
  it("resolves Wellington to Wellington CBD, never Mt Wellington", () => {
    expect(resolveLocation(branches, "Wellington")?.id).toBe(11);
  });
  it("keeps Wellington Airport separate", () => {
    expect(resolveLocation(branches, "Wellington Airport")?.id).toBe(13);
  });
  it("finds Hamilton and Christchurch rather than defaulting to Auckland", () => {
    expect(resolveLocation(branches, "Hamilton")?.id).toBe(17);
    expect(resolveLocation(branches, "Christchurch")?.id).toBe(16);
  });
  it("never substitutes passenger cars when no trucks are available", () => {
    expect(matchingVehicles([{ vehiclecategory: "Car", available: 1, avgrate: 50 }], "trucks")).toEqual([]);
  });
  it("returns only available matching trucks sorted by live daily rate", () => {
    const vehicles = [
      { vehiclecategory: "Large Truck", available: 1, avgrate: 150 },
      { vehiclecategory: "Car", available: 1, avgrate: 50 },
      { vehiclecategory: "Truck", available: 0, avgrate: 60 },
      { vehiclecategory: "Small Truck", available: 1, avgrate: 100 },
    ];
    expect(matchingVehicles(vehicles, "trucks").map((v) => v.avgrate)).toEqual([100, 150]);
  });
  it("uses Auckland date across the UTC day boundary", () => {
    expect(nzDate(new Date("2026-10-22T12:00:00Z"))).toBe("2026-10-23");
  });
});