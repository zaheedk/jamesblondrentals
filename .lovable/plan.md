# James Blond Broker API (RCM-compatible)

Goal: brokers (Zuzuche, QEEQ, others) switch by changing only the endpoint URL and their API key/secret. Everything else — methods, request fields, signature, response shapes, error format — stays identical to RCM's agent API v3.2.

## What brokers will call

```text
POST https://<project>.supabase.co/functions/v1/agent-api/agent/booking/v3.2?apikey=<JB key>
Header: signature: <uppercase hex HMAC-SHA256(raw body, JB secret)>
Body:   {"method": "step2", ...same params as RCM}
```
(A custom domain like api.jamesblond.co.nz can be pointed at this later.)

## All 11 methods mirrored
step1, locations, step2, step3, booking, editbooking, cancelbooking, bookinginfo, agentbookings, createdpspayment, confirmpayment — plus any other method name is passed through unchanged, so nothing a broker calls can break.

## Security (same as RCM, plus extras)
1. `apikey` query param looked up in a private broker-keys table (never readable from the website).
2. HMAC-SHA256 of the raw body with that broker's secret, compared in constant time; wrong/missing signature returns RCM's exact `{"status":"ERR","error":...}` with HTTP 200.
3. Keys can be disabled instantly; per-broker rate limit (e.g. 120 calls/min).
4. Broker isolation: `bookinginfo`, `editbooking`, `cancelbooking`, `agentbookings`, payments only work on bookings that broker created (checked via RCM's `agentinfo`).
5. Every call logged (broker, method, status, duration) for audit — no card data stored.
6. Secrets stored hashed? No — HMAC needs the raw secret, so secrets live only in the server-side table with no public access (same as RCM).

## How it works behind the scenes
Each James Blond broker key maps to that broker's existing RCM agent key/secret (stored securely). Our API verifies the broker, then re-signs and forwards the call to RCM, so the booking is still created in RCM under the correct agent, with correct commission and invoicing. Responses come back unchanged.

A pricing hook is built in but switched OFF: later it can adjust step2/step3 rates per demand level. Kept off until we confirm RCM books at the adjusted price (otherwise quote and invoice would differ).

## Admin
Small "Broker API" section in the existing admin area: create broker, generate key + secret (secret shown once), enable/disable, see recent call log.

## Testing
Read-only only with Zuzuche's credentials (step1, locations, step2, step3, bookinginfo, agentbookings), comparing our API's response to RCM's direct response byte-for-byte. No test bookings with live keys.

## Technical details
- Edge function `agent-api` (verify_jwt=false), shared HMAC helper.
- Tables: `agent_brokers` (name, jb_api_key, jb_secret, rcm_api_key, rcm_secret, active, rate_limit), `agent_api_log`. RLS on, grants to service_role only; admin read via has_role.
- Deliverable: broker onboarding doc (URL, signing example) in Files.
