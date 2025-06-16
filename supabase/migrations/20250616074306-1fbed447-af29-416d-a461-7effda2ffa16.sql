
-- Add RLS policy to allow anyone to insert into interest_registrations
-- This is needed for the public registration form to work
CREATE POLICY "Allow public registration submissions" 
ON public.interest_registrations 
FOR INSERT 
WITH CHECK (true);
