// Outcome rules for the admin voice-call report.
// - dropped: caller hung up before speaking with Sarah (only the greeting, or under 15s)
// - completed: Sarah finished a task — quote sent, booking looked up, link resent,
//   change request, callback or breakdown report
// - partial: caller talked with Sarah but no task was finished
export type CallOutcome = "dropped" | "partial" | "completed";

export const COMPLETING_TOOLS = [
  "create_phone_quote",
  "check_phone_booking",
  "check_booking",
  "resend_booking_links",
  "request_booking_change",
  "request_callback",
  "report_breakdown",
];

export interface CallSummary {
  call_duration_secs?: number;
  message_count?: number;
  tool_names?: string[] | null;
}

export function classifyCall(c: CallSummary): CallOutcome {
  const messages = c.message_count ?? 0;
  const duration = c.call_duration_secs ?? 0;
  if (messages <= 1 || duration < 15) return "dropped";
  if ((c.tool_names || []).some((t) => COMPLETING_TOOLS.includes(t))) return "completed";
  return "partial";
}

/** New Zealand calendar date (YYYY-MM-DD) for a unix timestamp. */
export function nzDay(unixSecs: number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland" }).format(new Date(unixSecs * 1000));
}
