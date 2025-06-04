
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CreatorCRMData {
  id: string;
  name: string;
  email: string;
  platform: string;
  followers: string;
  engagement: string;
  status: string;
  lastActive: string;
  totalDeals: number;
  activeDeals: number;
}

export const useCreatorCRM = () => {
  const { data: creators = [], isLoading, error } = useQuery({
    queryKey: ['admin-creator-crm'],
    queryFn: async (): Promise<CreatorCRMData[]> => {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          primary_platform,
          follower_count,
          engagement_rate,
          updated_at,
          created_at,
          profiles!creator_profiles_user_id_fkey (
            email
          )
        `)
        .eq('is_profile_complete', true);

      if (error) throw error;

      return (data || []).map(creator => {
        const displayName = creator.first_name && creator.last_name 
          ? `${creator.first_name} ${creator.last_name}`
          : creator.first_name || 'Unknown Creator';
        
        return {
          id: creator.user_id,
          name: displayName,
          email: creator.profiles?.email || 'No email',
          platform: creator.primary_platform || 'Unknown',
          followers: creator.follower_count ? creator.follower_count.toLocaleString() : '0',
          engagement: creator.engagement_rate ? `${creator.engagement_rate}%` : '0%',
          status: 'Active',
          lastActive: creator.updated_at || creator.created_at,
          totalDeals: 0, // TODO: Add deals count
          activeDeals: 0, // TODO: Add active deals count
        };
      });
    }
  });

  return {
    creators,
    isLoading,
    error
  };
};
