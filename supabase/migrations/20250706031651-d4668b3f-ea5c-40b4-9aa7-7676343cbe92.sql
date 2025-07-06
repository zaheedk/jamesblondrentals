-- Create table for storing scraped vehicle rental rates
CREATE TABLE public.vehicle_rental_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_name TEXT NOT NULL,
  vehicle_category TEXT NOT NULL,
  daily_rate DECIMAL(10,2),
  rental_period_days INTEGER NOT NULL,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vehicle_rental_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to view all rates
CREATE POLICY "Anyone can view rental rates" 
ON public.vehicle_rental_rates 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert rates
CREATE POLICY "Authenticated users can insert rental rates" 
ON public.vehicle_rental_rates 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update rates
CREATE POLICY "Authenticated users can update rental rates" 
ON public.vehicle_rental_rates 
FOR UPDATE 
TO authenticated
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vehicle_rental_rates_updated_at
BEFORE UPDATE ON public.vehicle_rental_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_vehicle_rental_rates_website ON public.vehicle_rental_rates(website_name);
CREATE INDEX idx_vehicle_rental_rates_category ON public.vehicle_rental_rates(vehicle_category);
CREATE INDEX idx_vehicle_rental_rates_period ON public.vehicle_rental_rates(rental_period_days);
CREATE INDEX idx_vehicle_rental_rates_scraped_at ON public.vehicle_rental_rates(scraped_at);