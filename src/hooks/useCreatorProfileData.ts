
import { useQuery } from '@tanstack/react-query';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { supabase } from '@/integrations/supabase/client';

export interface CreatorProfileData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  primaryPlatform: string;
  platforms: string[];
  contentTypes: string[];
  industries: string[];
  followerCount: string;
  engagementRate: string;
  creatorType: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  visibilitySettings: {
    showInstagram: boolean;
    showTiktok: boolean;
    showYoutube: boolean;
    showLinkedin: boolean;
    showLocation: boolean;
    showAnalytics: boolean;
  };
}

export const useCreatorProfileData = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['creator-profile-data', user?.id],
    queryFn: async (): Promise<CreatorProfileData | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching creator profile:', error);
        throw error;
      }

      if (!data) return null;

      return {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        username: data.username || '',
        bio: data.bio || '',
        primaryPlatform: data.primary_platform || '',
        platforms: data.platforms || [],
        contentTypes: data.content_types || [],
        industries: data.industries || [],
        followerCount: data.follower_count?.toString() || '0',
        engagementRate: data.engagement_rate?.toString() || '0',
        creatorType: data.creator_type || '',
        avatarUrl: data.avatar_url,
        bannerUrl: data.banner_url,
        visibilitySettings: data.visibility_settings || {
          showInstagram: true,
          showTiktok: true,
          showYoutube: true,
          showLinkedin: true,
          showLocation: true,
          showAnalytics: true
        }
      };
    },
    enabled: !!user?.id
  });
};
