# Caprice / WooKong integration preparation

Status: **not implemented or enabled**. Existing Zuzuche/QEEQ broker connections are unchanged.

## Authoritative contract

- Guide: https://m.wkzuche.com/activity/project/openapi
- English OpenAPI: https://imgoss.wkzuche.com/outbound/openapi/outbound-openapi-en.json
- Version: 1.0.1 (18 May 2026)
- Integration diagram: https://imgoss.wkzuche.com/outbound/openapi/biz-flow-chart-en.drawio.png
- Onboarding contact in the guide: otb-partner@wkzuche.com

WooKong calls supplier-hosted endpoints. This is not the RCM-compatible HMAC API used by Zuzuche; forwarding its bodies directly to `/agent/booking/v3.2/` will not work.

## Required supplier operations

All operations use POST. Business requests use JSON and a bearer token.

| Contract path | Function | RCM verification required |
| --- | --- | --- |
| `/api/getJwtToken` | Authenticate appId/password; return raw JWT as application/jwt | None; supplier authentication |
| `/api/locationDetailsSearch` | Paginated branch information and rental requirements | Branch metadata, coordinates, schedules and broker policy |
| `/api/vehicleSearch` | Paginated vehicle catalogue with SIPP codes | Category attributes, actual images and age restrictions |
| `/api/vehAvailRate` | Availability and package prices | Caprice agency's availability/rates, location/coordinate mapping |
| `/api/vehRateRule` | Quote details and package rules | Quote revalidation, cancellation, cover and payment terms |
| `/api/vehRes` | Create reservation | Caprice agency reservation method and exact field mapping |
| `/api/vehResStatusSearch` | Retrieve reservation status | Agent-scoped booking lookup and status mapping |
| `/api/vehCancel` | Cancel reservation and report charges | Verified cancellation method and agreed charge rules |
| `/api/notifDeposit` | Return post-rental financial information | Accessible RCM deposit/payment/damage/violation records |

`notifDeposit` is supplier-hosted according to both the operations tags and sequence diagram; do not invent an outbound callback URL.

## Authentication and safety requirements

- WooKong provides `appId`; the supplier provides the shared `password`. Optional `client_id` identifies the requesting security domain.
- JWT lifetime is four hours; verify signature, issuer, audience and expiry before every business operation.
- Requests carry `pos.language` (EN/CN) and millisecond `pos.timestamp`; the guide recommends rejecting skew above 30 minutes.
- WooKong retries timed-out calls three times with the same `wkzucheOrderId`. Booking creation must use durable, atomic idempotency and reconcile unknown RCM outcomes instead of repeating writes blindly.
- Keep quote references bound to location, dates, vehicle, currency and price. Restrict booking/status/cancellation/financial lookups to Caprice's own bookings.
- Never use Zuzuche/QEEQ credentials for Caprice; agency settings affect commission, pricing and attribution.
- Do not return fabricated rates, cancellation charges, policies, translations, successful cancellations or zero financial balances when data is unavailable.

## Proposed handover URL

`https://api.jamesblond.co.nz/caprice/api/…`

**Proposed only: no forwarder or endpoint has been created.** Confirm this base URL with Caprice before implementation/handover. The current `/agent/` endpoint remains unchanged.

## Outstanding setup

Collect the following using the secure secret form, never chat or source files:

- `CAPRICE_APP_ID`: assigned by Caprice/WooKong.
- `CAPRICE_PASSWORD`: one strong shared password agreed with Caprice. Create it with a password manager, share it with Caprice through a secure channel and save the identical value in the secure form. Do not use the internal JWT signing key as this password.
- `CAPRICE_VENDOR_CODE`: assigned supplier/company code.
- `CAPRICE_RCM_API_KEY` and `CAPRICE_RCM_SHARED_SECRET`: credentials for the dedicated Caprice RCM agency, obtained from RCM's agency API setup.

`CAPRICE_JWT_SECRET` has been generated and stored securely for internal signing; its value is not shared with Caprice. Other requested values were not saved because the secure form was declined.

Confirm wholesale/commission settings, cancellation fees, included insurance, collection arrangements, deposits and a test/certification contact. The published guide has no sandbox credentials or certification checklist.

The first hosted broker-configuration read returned a project-management authorization error. Hosted configuration/deployment access and actual Caprice-specific RCM responses remain unverified.

## Acceptance criteria before sales

1. Test auth rejection, four-hour expiry and stale timestamps.
2. Verify catalogue, availability, rates and policies against Caprice-specific live RCM reads.
3. Create one agreed test reservation; repeat its order ID and confirm no duplicate.
4. Read the reservation back and cancel it, confirming RCM's actual status and fees.
5. Verify post-rental records against known data and confirm another agency's booking cannot be accessed.
6. Confirm final branded URL works after Vercel deployment and obtain Caprice's acceptance.