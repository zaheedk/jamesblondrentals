# Project Architecture Rules

- Broker demo uses an isolated in-memory rehearsal API by default and a fixed-destination server signing relay for assigned broker credentials; no secrets are persisted, live writes require explicit confirmation, and live updates remain disabled until separate maintenance access exists.

- Truck-hire hubs and city pages reuse TruckHireLocations for collection addresses and city links; this keeps nearby-search content consistent without changing live RCM search or inventing additional branches.

- The Hamilton vehicle-hire hub reuses SearchForm with explicit branch defaults via the shared search-location-default helper and links to existing category pages; this keeps its search local without changing other forms' saved-location behaviour or live RCM quoting.

- Vehicle search display uses shared availability and ordering helpers; the originating search page travels in the URL so Wellington van intent survives navigation without changing RCM pricing or availability.

- Customer portal booking cards must use the `vehicleimage` and `urlpathfordocuments` returned by RCM `bookinginfo`, never infer vehicle photos from names; this keeps displayed vehicles aligned with live booking data.
- Portal profile saves push to all open RCM bookings, while additional drivers are retained in the customer's reusable list and assigned/synced only to a selected booking through `booking_additional_drivers`; closed/returned bookings remain read-only because RCM rejects edits to them.
- Portal saved cards go through RCM's Windcave (rcm-save-card: createdpspayment $0 transactiontype Validate, then confirmpayment transtype Auth with the rebilling token on every open booking) so staff can charge them inside RCM; Airwallex tokens are unusable in RCM.
- Broker API (agent-api edge function) re-signs and forwards broker calls to RCM's agent API using each broker's own RCM agent credentials (env `<REF>_RCM_API_KEY/_RCM_SHARED_SECRET`); keeps commission/invoicing in RCM and makes brokers switch with only endpoint + key changes. RCM agent URL needs the trailing slash.
- api.jamesblond.co.nz/agent/* is proxied to the agent-api edge function by the Vercel Edge Function `api/agent-proxy.js (reached via vercel.json rewrite /agent/:path* — catch-all filenames failed on dotted paths like v3.2)`, not by vercel.json — Vercel's Vite preset ignores vercel.json external rewrites on this project (SPA fallback wins), so external proxying must live in a function.
- Quote reminders run daily via pg_cron calling send-quote-reminders with a vault-stored token; quote_reminder_log claims each (quote, kind) before sending so reminders are never duplicated.
- Quote reminder opens/clicks are tracked by the public quote-reminder-track function keyed on the quote_reminder_log row id (pixel + redirect to /complete-booking); keeps tracking in our DB without depending on Resend webhooks.
- Pickup activation texts use TNZ REST with a server-only Auth Token and TNZ-assigned NZ short code; store its MessageID in the existing per-booking channel log so switching providers preserves deduplication.
- Pickup reminders resolve account destinations server-side and reuse one generated recovery link across email/SMS for never-signed-in users; activated users receive the login URL so reminders never reset their credentials. Activation links are built as www.jamesblond.co.nz/reset-password?token_hash=...&type=recovery (verified via verifyOtp on the reset page) so customers never see the auth provider domain.
- Admin Tools sends sample pickup texts through the existing authenticated reminder function, never directly to TNZ from the browser; this preserves server-side credentials and admin checks.
- Password recovery retains the recovery session, verifies the user after password saving, and opens the portal profile directly; avoid hash-only checks because the auth client consumes recovery URLs during initialization.
- Admin pickup reminder logs read the existing admin-only log with pagination and check TNZ delivery through the authenticated reminder function; never label provider acceptance as confirmed delivery or display activation tokens.
