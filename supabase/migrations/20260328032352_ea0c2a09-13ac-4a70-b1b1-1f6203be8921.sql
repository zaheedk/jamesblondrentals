UPDATE public.bookings 
SET booking_status = 'confirmed', 
    payment_status = 'paid',
    updated_at = now()
WHERE booking_reference = 'BK20260328-5897AF';