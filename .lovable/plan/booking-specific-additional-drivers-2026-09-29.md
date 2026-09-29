# Booking-specific additional drivers

## What will change
- Remove the separate **Drivers** section from the customer portal.
- Add **Additional drivers** inside each booking’s expanded details.
- Let a customer add a new driver to that booking or choose a driver retained from a previous booking.
- Show only the drivers assigned to the selected booking.
- Keep licence photo uploads and editing available for retained driver records.

## Data and access
- Keep the existing additional-driver records as the customer’s private reusable driver list.
- Add a booking-to-driver assignment table so one saved driver can be used on one or several bookings without duplicating their details.
- Restrict customers to viewing and changing assignments for their own bookings and their own saved drivers; retain staff access.

## RCM behaviour
- Add, update, or remove a driver only on the selected RCM booking.
- Continue skipping closed or returned bookings because RCM rejects those changes.
- Never remove staff-added drivers unless they match the customer-selected saved driver.
- Existing saved portal drivers remain available as past drivers but will not be automatically assigned to every open booking.

## Verification
- Confirm a retained driver can be selected for one booking without appearing on another.
- Confirm adding and removing the assignment updates only that booking in RCM.
- Check desktop and mobile booking details and ensure the preview remains error-free.