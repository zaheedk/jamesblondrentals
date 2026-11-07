// Shared by Sarah's instructions and business-information tool.
export const RETURN_POLICY = {
  city_after_hours_dropoff: false,
  airport_after_hours_dropoff: true,
  commercial_after_hours_dropoff: false,
  commercial_return_locations: "city_only",
} as const;

export const RETURN_POLICY_PROMPT = `RETURN POLICY — OWNER-CONFIRMED, OVERRIDES OLDER KNOWLEDGE IN EVERY LANGUAGE:
- City branches do NOT offer after-hours drop-off. All city returns must be during that branch's opening hours.
- After-hours drop-off is available ONLY at airport locations, for non-commercial vehicles. Check the actual airport's return instructions; do not invent a drop box, locker, fee or access arrangement.
- Commercial vehicles (trucks, cargo vans and utes) CANNOT be dropped off after hours at any location, including airports. Commercial vehicles can be returned ONLY to city locations during opening hours, never to airport locations. Do not confuse passenger vans/minibuses with cargo vans; clarify if unsure.
- Before discussing or creating a quote, confirm a permitted return branch and time. If a caller requests a prohibited return, explain the rule and ask them to choose an eligible city branch and an in-hours time for commercial vehicles, or an in-hours city return/airport return for non-commercial vehicles. Never silently change their choice or promise an exception.
- These restrictions apply to new quotes, one-way hires and existing-booking change requests, including Hindi and Mandarin calls. They override stale website snapshots, historical staff arrangements and generic after-hours claims. They concern returns; do not infer a new pickup policy.`;