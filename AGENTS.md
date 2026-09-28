# Project Architecture Rules

- Customer portal booking cards must use the `vehicleimage` and `urlpathfordocuments` returned by RCM `bookinginfo`, never infer vehicle photos from names; this keeps displayed vehicles aligned with live booking data.- Portal profile/driver saves push to open RCM bookings via the `rcm-sync-profile` edge function (editbooking/extradriver v3.1, preserving insurance/extras from bookinginfo, keeping the RCM email); closed/returned bookings are skipped because RCM rejects edits to them.
