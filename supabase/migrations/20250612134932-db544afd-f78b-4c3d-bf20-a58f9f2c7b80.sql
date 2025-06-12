
-- Create pricing_floors table
CREATE TABLE IF NOT EXISTS public.pricing_floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL CHECK (tier IN ('Nano', 'Micro', 'Mid', 'Macro', 'Large', 'Celebrity')),
  campaign_type text NOT NULL CHECK (campaign_type IN ('Single', 'Weekly', 'Monthly', '12-Month Retainer', 'Evergreen')),
  min_price numeric NOT NULL CHECK (min_price >= 0),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(tier, campaign_type)
);

-- Add RLS policies
ALTER TABLE public.pricing_floors ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage pricing floors
CREATE POLICY "Admins can manage pricing floors" ON public.pricing_floors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Insert default pricing data
INSERT INTO public.pricing_floors (tier, campaign_type, min_price) VALUES
  ('Nano', 'Single', 300),
  ('Nano', 'Weekly', 750),
  ('Nano', 'Monthly', 1500),
  ('Nano', '12-Month Retainer', 10000),
  ('Nano', 'Evergreen', 2000),
  ('Micro', 'Single', 500),
  ('Micro', 'Weekly', 1000),
  ('Micro', 'Monthly', 2000),
  ('Micro', '12-Month Retainer', 12000),
  ('Micro', 'Evergreen', 2500),
  ('Mid', 'Single', 1000),
  ('Mid', 'Weekly', 2000),
  ('Mid', 'Monthly', 4000),
  ('Mid', '12-Month Retainer', 15000),
  ('Mid', 'Evergreen', 4000),
  ('Macro', 'Single', 2000),
  ('Macro', 'Weekly', 4000),
  ('Macro', 'Monthly', 6000),
  ('Macro', '12-Month Retainer', 20000),
  ('Macro', 'Evergreen', 6000),
  ('Large', 'Single', 4000),
  ('Large', 'Weekly', 6000),
  ('Large', 'Monthly', 10000),
  ('Large', '12-Month Retainer', 30000),
  ('Large', 'Evergreen', 8000),
  ('Celebrity', 'Single', 10000),
  ('Celebrity', 'Weekly', 15000),
  ('Celebrity', 'Monthly', 25000),
  ('Celebrity', '12-Month Retainer', 75000),
  ('Celebrity', 'Evergreen', 15000)
ON CONFLICT (tier, campaign_type) DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_pricing_floors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pricing_floors_updated_at
  BEFORE UPDATE ON public.pricing_floors
  FOR EACH ROW
  EXECUTE FUNCTION update_pricing_floors_updated_at();
