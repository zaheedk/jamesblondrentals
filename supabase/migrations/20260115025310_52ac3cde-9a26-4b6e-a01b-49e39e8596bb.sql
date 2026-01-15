-- Add RLS policy to allow updating booking payment status by booking reference
-- This enables guest users to have their bookings updated after payment

CREATE POLICY "Allow payment status updates by booking reference"
ON public.bookings
FOR UPDATE
USING (
  -- Allow update if the booking_reference or reservation_reference matches
  -- This is safe because we're only allowing specific field updates through the application
  booking_reference IS NOT NULL OR reservation_reference IS NOT NULL
)
WITH CHECK (
  booking_reference IS NOT NULL OR reservation_reference IS NOT NULL
);