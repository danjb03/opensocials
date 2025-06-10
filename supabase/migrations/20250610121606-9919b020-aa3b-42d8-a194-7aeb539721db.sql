
-- Create a table to store interest registrations
CREATE TABLE public.interest_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('creator', 'brand', 'agency')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert registrations (public form)
CREATE POLICY "Anyone can register interest" 
  ON public.interest_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that only allows admins to view registrations
CREATE POLICY "Only admins can view registrations" 
  ON public.interest_registrations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
