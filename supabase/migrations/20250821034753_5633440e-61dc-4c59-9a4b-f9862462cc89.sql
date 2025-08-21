-- Create booking feedback table
CREATE TABLE public.booking_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  suggestions TEXT,
  user_id UUID REFERENCES auth.users(id),
  booking_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.booking_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert feedback" 
ON public.booking_feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own feedback" 
ON public.booking_feedback 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_booking_feedback_updated_at
BEFORE UPDATE ON public.booking_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();