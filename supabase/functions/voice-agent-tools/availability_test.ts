import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { matchingVehicles, perKmCharge } from "./availability.ts";

// Shapes taken from the live Hamilton result for 25–26 Oct 2026.
const fleet = [
  { vehiclecategory: "2 Ton Box (16m³-18m³)", vehiclecategorytypeid: 12, available: 1, avgrate: 130 },
  { vehiclecategory: "2 Ton Box (9m³ - 12m³)", vehiclecategorytypeid: 12, available: 1, avgrate: 130 },
  { vehiclecategory: "2 Ton Box (9m³-12m³) Tail Lift", vehiclecategorytypeid: 12, available: 0, avgrate: 0 },
  { vehiclecategory: "3 Ton Box (16m³-18m³)Tail Lift", vehiclecategorytypeid: 12, available: 1, avgrate: 160 },
  { vehiclecategory: "Premium 12 Seat Minibus", categoryfriendlydescription: "LDV Deliver 9 or similar", vehiclecategorytypeid: 4, available: 1, avgrate: 280 },
  { vehiclecategory: "Standard Cargo Van", vehiclecategorytypeid: 11, available: 1, avgrate: 115 },
];
const names = (q: string) => matchingVehicles(fleet, q).map((v) => v.vehiclecategory);

Deno.test("'two-ton truck' finds the available 2 Ton Box trucks", () => {
  assertEquals(names("two-ton truck"), ["2 Ton Box (16m³-18m³)", "2 Ton Box (9m³ - 12m³)"]);
});

Deno.test("'2 tonne box truck' and '2t truck' match the same trucks", () => {
  assertEquals(names("2 tonne box truck").length, 2);
  assertEquals(names("2t truck").length, 2);
});

Deno.test("'truck' finds all available trucks", () => {
  assertEquals(names("truck").length, 3);
});

Deno.test("'3 ton truck' excludes 2 ton trucks", () => {
  assertEquals(names("3 ton truck"), ["3 Ton Box (16m³-18m³)Tail Lift"]);
});

Deno.test("'12 seater' finds the minibus, not trucks or vans", () => {
  assertEquals(names("12 seater"), ["Premium 12 Seat Minibus"]);
});

Deno.test("'van' finds cargo vans only", () => {
  assertEquals(names("van"), ["Standard Cargo Van"]);
});

// Per-km charges mirror the published price guide.
Deno.test("per-km charge: 2 Ton Box 9-12m3 is $0.42, 16-18m3 is $0.47", () => {
  assertEquals(perKmCharge({ vehiclecategory: "2 Ton Box (9m³ - 12m³)", vehiclecategorytypeid: 12 }), 0.42);
  assertEquals(perKmCharge({ vehiclecategory: "2 Ton Box (16m³-18m³)", vehiclecategorytypeid: 12 }), 0.47);
});

Deno.test("per-km charge: tail lift, tipper and 3-tonne trucks", () => {
  assertEquals(perKmCharge({ vehiclecategory: "2 Ton Box (9m³-12m³) Tail Lift", vehiclecategorytypeid: 12 }), 0.44);
  assertEquals(perKmCharge({ vehiclecategory: "2 Ton Tipper", vehiclecategorytypeid: 12 }), 0.39);
  assertEquals(perKmCharge({ vehiclecategory: "3 Ton Box (16m³-18m³)Tail Lift", vehiclecategorytypeid: 12 }), 0.61);
  assertEquals(perKmCharge({ vehiclecategory: "3 Ton Tail Lift Class2 (19m³)", vehiclecategorytypeid: 12 }), 0.62);
});

Deno.test("per-km charge: vans and utes", () => {
  assertEquals(perKmCharge({ vehiclecategory: "Jumbo Van (9m³)", vehiclecategorytypeid: 24 }), 0.39);
  assertEquals(perKmCharge({ vehiclecategory: "High Roof Van", vehiclecategorytypeid: 11 }), 0.35);
  assertEquals(perKmCharge({ vehiclecategory: "Standard Cargo Van", vehiclecategorytypeid: 11 }), null);
  assertEquals(perKmCharge({ vehiclecategory: "Ute Double Cab 4WD (Diesel)", vehiclecategorytypeid: 10 }), 0.3);
  assertEquals(perKmCharge({ vehiclecategory: "Ute Single Cab Diesel", vehiclecategorytypeid: 10 }), 0.25);
});

Deno.test("per-km charge: cars and minibuses have unlimited kilometres", () => {
  assertEquals(perKmCharge({ vehiclecategory: "Compact Car", vehiclecategorytypeid: 1 }), null);
  assertEquals(perKmCharge({ vehiclecategory: "Premium 12 Seat Minibus", vehiclecategorytypeid: 4 }), null);
});
