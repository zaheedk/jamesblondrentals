-- Create bookings table to capture all booking information
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Vehicle information
  vehicle_id TEXT,
  vehicle_name TEXT,
  vehicle_type TEXT,
  vehicle_category TEXT,
  daily_rate DECIMAL(10,2),
  
  -- Booking dates and times
  pickup_date DATE NOT NULL,
  dropoff_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  dropoff_time TIME NOT NULL,
  total_days INTEGER NOT NULL,
  
  -- Location information
  pickup_location_id TEXT,
  pickup_location_name TEXT,
  dropoff_location_id TEXT,
  dropoff_location_name TEXT,
  
  -- Customer information
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_license_number TEXT,
  customer_age INTEGER,
  
  -- Booking totals
  vehicle_total DECIMAL(10,2),
  extras_total DECIMAL(10,2) DEFAULT 0,
  insurance_total DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  
  -- Selected extras (JSON array)
  selected_extras JSONB DEFAULT '[]'::jsonb,
  
  -- Insurance options (JSON object)
  insurance_options JSONB DEFAULT '{}'::jsonb,
  
  -- Payment information
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_intent_id TEXT,
  
  -- Booking status and references
  booking_status TEXT DEFAULT 'pending',
  booking_reference TEXT UNIQUE,
  reservation_reference TEXT,
  
  -- Additional information
  special_requirements TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings access
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to automatically generate booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate booking reference
CREATE TRIGGER generate_booking_reference_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_booking_reference();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_pickup_date ON public.bookings(pickup_date);
CREATE INDEX idx_bookings_booking_reference ON public.bookings(booking_reference);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);