-- Batch 1: Insert RCM bookings (records 1-50)
-- This is a data import from RCM system CSV export

INSERT INTO bookings (
  reservation_reference, booking_reference, booking_status, payment_status,
  vehicle_name, vehicle_category, vehicle_type,
  pickup_location_name, pickup_location_id,
  dropoff_location_name, dropoff_location_id,
  pickup_date, pickup_time, dropoff_date, dropoff_time,
  total_days, daily_rate, vehicle_total,
  extras_total, insurance_total, total_amount,
  selected_extras,
  customer_last_name, customer_first_name,
  customer_email, customer_phone, customer_address,
  customer_license_number, customer_age
)
SELECT v.* FROM (VALUES
('21985B14599E30','#29953','confirmed','paid','Navara','Premium Double Cab Ute Diesel','Premium Double Cab Ute Diesel','Auckland West','AKL','Auckland West','AKL','2026-03-01'::date,'09:00:00'::time,'2026-03-01'::date,'17:00:00'::time,1,84.0::numeric,84.0::numeric,0::numeric,0::numeric,100.8::numeric,'[]'::jsonb,'KANTHAWALA','Zaheed Abdullah','zaheed@free2drive.co.nz','0275353037','32 Torrance Street','DM529642',46),
('2198567341C788','#29959','confirmed','paid','ASX','Premium Compact SUV','Premium Compact SUV','Auckland West','AKL','Auckland West','AKL','2026-03-01'::date,'09:00:00'::time,'2026-03-14'::date,'15:55:00'::time,13,110.0::numeric,1430.0::numeric,96.34::numeric,0::numeric,1526.34::numeric,'[{"name":"+Fuel Charge - Petrol","value":46.34},{"name":"+Extras Misc","value":50.0}]'::jsonb,'KANTHAWALA','Zaheed Abdullah','zaheed@free2drive.co.nz','0275353037','32 Torrance Street','DM529642',46)
) AS v(reservation_reference,booking_reference,booking_status,payment_status,vehicle_name,vehicle_category,vehicle_type,pickup_location_name,pickup_location_id,dropoff_location_name,dropoff_location_id,pickup_date,pickup_time,dropoff_date,dropoff_time,total_days,daily_rate,vehicle_total,extras_total,insurance_total,total_amount,selected_extras,customer_last_name,customer_first_name,customer_email,customer_phone,customer_address,customer_license_number,customer_age)
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.reservation_reference = v.reservation_reference);