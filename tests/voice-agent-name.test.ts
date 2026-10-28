import { test, expect } from "bun:test";
import {
  AGENT_NAME,
  AGENT_DISPLAY_NAME,
  openingMessage,
} from "../supabase/functions/voice-agent-admin/identity.ts";

test("the phone agent opens by introducing itself as Sarah", () => {
  expect(AGENT_NAME).toBe("Sarah");
  const greeting = openingMessage();
  expect(greeting).toContain("I'm Sarah");
  expect(greeting).toContain("AI assistant");
});

test("the agent's dashboard name carries the same name as the greeting", () => {
  expect(AGENT_DISPLAY_NAME).toContain(AGENT_NAME);
  expect(AGENT_DISPLAY_NAME).toContain("James Blond Rentals");
});

test("a renamed agent changes the greeting and dashboard name together", () => {
  expect(openingMessage("Kiri")).toContain("I'm Kiri");
  expect(openingMessage("Kiri")).not.toContain("Sarah");
});

test("the greeting says the team is busy and Sarah can book or change bookings", () => {
  const g = openingMessage();
  expect(g).toContain("busy");
  expect(g).toContain("new bookings");
  expect(g).toContain("changes to an existing booking");
});
