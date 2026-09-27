# Project Architecture Rules

- Customer portal booking cards must use the `vehicleimage` and `urlpathfordocuments` returned by RCM `bookinginfo`, never infer vehicle photos from names; this keeps displayed vehicles aligned with live booking data.