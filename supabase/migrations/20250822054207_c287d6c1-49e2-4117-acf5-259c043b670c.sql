-- Add customer name and email columns to booking_feedback table
ALTER TABLE public.booking_feedback 
ADD COLUMN customer_name TEXT,
ADD COLUMN customer_email TEXT;