-- Fix security warning: Set search_path for generate_booking_reference function
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
  END IF;
  RETURN NEW;
END;
$$;