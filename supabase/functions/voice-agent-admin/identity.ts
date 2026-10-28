// The phone agent's public identity, single-sourced so the ElevenLabs display
// name, the greeting callers hear and the model's own self-description cannot
// drift apart. Voices are chosen separately per language, so a caller may hear
// a different voice after a language switch — the name stays the same.
export const AGENT_NAME = "Sarah";

export const AGENT_DISPLAY_NAME = `${AGENT_NAME} — James Blond Rentals Phone Assistant`;

// The caller hears this first, so it must carry the name and the AI disclosure.
export function openingMessage(name = AGENT_NAME) {
  return `Kia ora, thanks for calling James Blond Rentals. This is ${name}, your AI assistant — how can I help you today?`;
}
