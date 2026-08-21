# Add Klarna at checkout via Airwallex

Yes — Airwallex works very much like Windcave in your current flow: you create a payment session server-side, redirect the customer to an Airwallex-hosted checkout, they come back to a return URL, and a webhook confirms the outcome. Klarna is offered as one of the payment methods inside that hosted checkout.

## Before we build — two things to confirm

1. **Klarna eligibility.** Klarna through Airwallex is enabled per-account and per-buyer-country. Your Airwallex account needs Klarna activated, and it typically works for buyers in AU/UK/EU/US rather than NZ. That actually fits your Australian and UK traffic well, but it means Klarna should appear as an *additional* option, not a replacement for Windcave.
2. **Vehicle rental + BNPL.** Klarna pays you the full amount up front, but it cannot hold a security bond as a pre-authorisation. So Klarna should be offered on the **rental amount only** (deposit or full rental minus bond), with the bond still taken by card at pickup. Existing bond logic already excludes bond from "Due Now", so this lines up.

## How the integration works

```text
PaymentOptions  ->  choose "Pay with Klarna"
      |
      v
airwallex-create-payment (edge function)
   - POST /api/v1/authentication/login  -> access token
   - POST /api/v1/pa/payment_intents/create  (amount, currency, merchant_order_id = RCM reservationref)
   - POST .../create_session or Hosted Payment Page URL with return_url = /payment?provider=airwallex
      |
      v
Airwallex hosted page (Klarna selected)  ->  customer approves at Klarna
      |
      +--> browser returns to /payment?provider=airwallex&intent_id=...
      |         -> calls airwallex-verify-payment, then existing RCM confirmpayment + booking update
      |
      +--> webhook POST to airwallex-webhook (payment_intent.succeeded / .failed)
                -> verifies HMAC signature, updates booking row idempotently
```

The webhook is the source of truth (Klarna can settle after the browser closes); the return-URL check is for instant UX.

## What gets built

**Backend (Supabase edge functions, no JWT required for the webhook)**

- `airwallex-create-payment` — authenticates with Airwallex, creates a payment intent for the amount already computed in `PaymentOptions`, returns the hosted-checkout URL. Uses `merchant_order_id = RCM reservation ref` so everything reconciles.
- `airwallex-verify-payment` — retrieves the intent by id, returns normalised status (`Approved` / `Failed` / `Pending`).
- `airwallex-webhook` — verifies the Airwallex signature header, then on success calls the same RCM `confirmpayment` (with an Airwallex pay type instead of `Windcave`) and marks the booking paid/confirmed. Idempotent on intent id.

**Database**

- `payment_transactions` table (provider, intent id, reservation ref, amount, currency, status, raw payload, timestamps) with RLS: service role full access, no anon access. Gives you an audit trail and webhook idempotency.

**Frontend**

- `PaymentOptions.tsx` — add a payment-method choice: *Card (Windcave)* or *Klarna – pay in 4 (via Airwallex)*, with eligibility copy and the bond note. Klarna hidden when the amount falls outside Klarna's limits.
- `Payment.tsx` — branch on `provider=airwallex`: call the create function and redirect, and on return call verify then continue into the existing `/payment-success` flow. Windcave path untouched.
- Reuse existing `booking-session` fields (`paymentAmount`, `paymentType`) plus a new `paymentProvider`.

**Secrets needed from you** (I'll open the secure form when you approve):
`AIRWALLEX_CLIENT_ID`, `AIRWALLEX_API_KEY`, `AIRWALLEX_WEBHOOK_SECRET`, and whether to start in **demo** or **production** (Airwallex has separate demo credentials and host).

## Sequencing

1. Table + three edge functions, deployed so you have the webhook URL.
2. You add the secrets and register the webhook URL in the Airwallex dashboard (Developer → Webhooks, events `payment_intent.succeeded`, `payment_intent.failed`, `payment_intent.cancelled`).
3. Frontend Klarna option + return handling.
4. End-to-end test on Airwallex demo with a Klarna test buyer, then flip to production.
