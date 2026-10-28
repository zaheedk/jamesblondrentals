import { test, expect } from "bun:test";
import {
  AGENT_NAME,
  AGENT_DISPLAY_NAME,
  openingMessage,
} from "../supabase/functions/voice-agent-admin/identity.ts";

test("the phone agent opens by introducing itself as Sarah", () => {
  expect(AGENT_NAME).toBe("Sarah");
  const greeting = openingMessage();
  expect(greeting).toContain("This is Sarah");
  expect(greeting).toContain("AI assistant");
});

test("the agent's dashboard name carries the same name as the greeting", () => {
  expect(AGENT_DISPLAY_NAME).toContain(AGENT_NAME);
  expect(AGENT_DISPLAY_NAME).toContain("James Blond Rentals");
});

test("a renamed agent changes the greeting and dashboard name together", () => {
  expect(openingMessage("Kiri")).toContain("This is Kiri");
  expect(openingMessage("Kiri")).not.toContain("Sarah");
});
