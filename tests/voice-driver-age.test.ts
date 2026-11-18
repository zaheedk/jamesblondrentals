import { test, expect } from "bun:test";
import { driverAgeOptions, resolveDriverAge } from "../supabase/functions/voice-agent-tools/driver-age";

const ages = [{ id: 10, driverage: 20 }, { id: 4, driverage: 21 }, { id: 8, driverage: 25 }, { id: 9, driverage: 26, isdefault: true }];

test("a 56-year-old uses the live 26+ band without another age lookup", () => {
  expect(resolveDriverAge(ages, 56)?.id).toBe(9);
});
test("younger drivers retain their actual band rather than the default", () => {
  expect(resolveDriverAge(ages, 21)?.id).toBe(4);
  expect(resolveDriverAge(ages, 25)?.id).toBe(8);
});
test("an actual age supersedes a stale guessed id", () => {
  expect(resolveDriverAge(ages, 56, 999)?.id).toBe(9);
});
test("invalid ages or ids do not fabricate an adult band", () => {
  expect(resolveDriverAge(ages, 19)).toBeUndefined();
  expect(resolveDriverAge(ages, 101)).toBeUndefined();
  expect(resolveDriverAge(ages, undefined, 999)).toBeUndefined();
  expect(driverAgeOptions(ages)).toContainEqual({ id: 9, label: "26" });
});