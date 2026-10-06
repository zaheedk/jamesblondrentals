# Caprice broker integration

## What will be built
A dedicated Caprice/WooKong connection using their published integration guide, while keeping the existing Zuzuche and QEEQ connections unchanged.

- Secure sign-in for Caprice with four-hour access tokens.
- Branch and vehicle information, live availability and prices, and rental rules.
- Booking creation, booking-status lookup and cancellation, linked to Caprice's own agency in RCM.
- Post-rental payment/deposit information where RCM supplies the required records.
- Protection against duplicate bookings when Caprice repeats a request after a timeout.

## Setup needed before going live
- Caprice's assigned **appId** and supplier/company code.
- A dedicated Caprice agency in RCM with the agreed wholesale/commission settings and agent API credentials. Credentials will be collected securely, not pasted into chat.
- Confirmation of the commercial terms: cancellation charges, included cover, payment collection and any deposit requirements. Existing website rules will not automatically be treated as broker terms.
- Caprice's test contact and acceptance requirements. The published guide does not include test credentials or a certification checklist.

These details do not prevent preparing the adapter, but live bookings will stay disabled until the account, prices and policies are verified.

## Technical implementation
- Follow WooKong OpenAPI **v1.0.1**, obtained from the guide's English specification; implement the nine documented POST paths under a separate branded prefix, proposed as `https://api.jamesblond.co.nz/caprice/api/…`.
- Add a separate Supabase edge function and Vercel forwarder rather than changing the RCM-compatible `/agent/` service. Confirm Caprice accepts this base URL before handover.
- Validate appId/password server-side and issue signed JWTs; verify signature, issuer, audience and expiry on every protected request. Keep credentials and signing keys outside browser code.
- Map Caprice's request/response structures to RCM using **Caprice-specific** agent credentials, preserving agency attribution, pricing and booking isolation. Verify actual RCM methods and response fields before implementing each mapping; never substitute another broker's credentials.
- Store short-lived quote references so the selected vehicle, dates, locations, currency and price can be revalidated before booking.
- Persist Caprice order IDs with a unique constraint and atomic booking state transitions. Do not blindly retry booking writes when their outcome is unknown; reconcile with RCM before another submission.
- Restrict status, cancellation and post-rental lookups to Caprice's own bookings. Return explicit failures for unsupported data rather than inventing charges or successful cancellations.
- Use the documented timestamp/language conventions, schema validation, and private operational logs without customer details or credentials.
- Add RLS and explicit grants for new tables; record the adapter architecture in the project rules.

## Verification and handover
- Run focused tests for token expiry, authentication rejection, request validation, quote binding, booking isolation and duplicate-order handling.
- Verify authenticated read-only calls against live RCM once Caprice's credentials are available.
- Complete an agreed test reservation, status lookup and cancellation with Caprice before enabling real sales; test post-rental records when suitable RCM data is available.
- Provide the final base URL, endpoint list and setup instructions. Share any supplier-issued password securely.

## Current access issue
The first hosted RCM broker-configuration lookup failed because the project management connection was not authorised. Retry access during implementation; if it remains unavailable, deployment and live verification will be reported as blocked rather than complete.