# Project Architecture Rules

- Customer portal booking cards must use the `vehicleimage` and `urlpathfordocuments` returned by RCM `bookinginfo`, never infer vehicle photos from names; this keeps displayed vehicles aligned with live booking data.
- Portal profile saves push to all open RCM bookings, while additional drivers are retained in the customer's reusable list and assigned/synced only to a selected booking through `booking_additional_drivers`; closed/returned bookings remain read-only because RCM rejects edits to them.
- Portal saved cards go through RCM's Windcave (rcm-save-card: createdpspayment $0 transactiontype Validate, then confirmpayment transtype Auth with the rebilling token on every open booking) so staff can charge them inside RCM; Airwallex tokens are unusable in RCM.
