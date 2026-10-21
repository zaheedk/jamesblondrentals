export const READ_METHODS = ["step1", "locations", "step2", "step3", "bookinginfo", "agentbookings", "cancelreasons"];
export const WRITE_METHODS = ["booking", "cancelbooking"];

export function validateDemoCall(payload: Record<string, unknown>, confirmed: boolean): string | null {
  const method = String(payload.method ?? "");
  if (![...READ_METHODS, ...WRITE_METHODS].includes(method)) return "This operation is not enabled on the booking demo endpoint. Updates require separate approved access.";
  if (WRITE_METHODS.includes(method) && !confirmed) return "Confirm the production write before continuing.";
  if (method === "booking" && payload.bookingtype !== 2) return "This demo creates bookings only (bookingtype 2).";
  if (method === "cancelbooking" && (!payload.reservationref || !payload.reasonid)) return "A booking reference and returned cancellation reason ID are required.";
  return null;
}