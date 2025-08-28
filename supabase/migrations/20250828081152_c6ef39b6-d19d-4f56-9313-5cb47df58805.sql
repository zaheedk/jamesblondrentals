-- Update RLS policies for bookings table to allow admin access
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Create new policy that allows users to see their own bookings OR admins to see all bookings
CREATE POLICY "Users can view their own bookings or admins can view all" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.email = 'zaheedk@gmail.com'
  )
);