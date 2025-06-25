
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export interface BrandProfileData {
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  industry: string | null;
  budget_range: string | null;
  brand_bio: string | null;
  brand_goal: string | null;
  campaign_focus: string[] | null;
  is_complete: boolean;
}

export const useBrandProfile = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['brand-profile', user?.id],
    queryFn: async (): Promise<BrandProfileData | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching brand profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });
};
