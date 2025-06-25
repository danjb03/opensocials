
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreatorProfile } from '@/types/creatorProfile';
import { transformCreatorProfile, createEmptyCreatorProfile } from '@/utils/creatorProfileTransform';

export const useCreatorProfileData = () => {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // First check profiles table for avatar
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        // Then check creator_profiles table
        const { data: creatorData, error } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching creator profile:', error);
          throw error;
        }

        if (creatorData) {
          // Parse social_handles safely
          let socialLinks = null;
          if (creatorData.social_handles && typeof creatorData.social_handles === 'object') {
            socialLinks = creatorData.social_handles as Record<string, any>;
            // Ensure it matches the expected structure
            const validSocialLinks: { [key: string]: string } = {};
            Object.entries(socialLinks).forEach(([key, value]) => {
              if (typeof value === 'string') {
                validSocialLinks[key] = value;
              }
            });
            socialLinks = validSocialLinks;
          }

          // Parse audience_location safely
          let audienceLocation = 'Global';
          if (typeof creatorData.audience_location === 'string') {
            audienceLocation = creatorData.audience_location;
          } else if (creatorData.audience_location && typeof creatorData.audience_location === 'object') {
            const locationObj = creatorData.audience_location as any;
            audienceLocation = locationObj.primary || 'Global';
          }

          // Transform the data to match CreatorProfileRecord interface
          const transformedData = {
            user_id: creatorData.user_id,
            display_name: creatorData.first_name && creatorData.last_name 
              ? `${creatorData.first_name} ${creatorData.last_name}` 
              : creatorData.username || '',
            bio: creatorData.bio || null,
            follower_count: creatorData.follower_count || null,
            engagement_rate: creatorData.engagement_rate || null,
            primary_platform: creatorData.primary_platform || null,
            content_type: creatorData.content_type || null,
            audience_type: creatorData.audience_type || null,
            audience_location: audienceLocation,
            creator_type: creatorData.creator_type || null,
            industries: creatorData.industries || null,
            categories: creatorData.content_types || null,
            platform_types: creatorData.platforms || null,
            social_links: socialLinks,
            audience_stats: null,
            headline: null,
            rate_card_url: null,
            created_at: creatorData.created_at || null,
            updated_at: creatorData.updated_at || null
          };
          
          const transformedProfile = transformCreatorProfile(transformedData);
          
          // Add avatar URL from profiles table
          if (profileData?.avatar_url) {
            transformedProfile.avatarUrl = profileData.avatar_url;
          }
          
          setProfile(transformedProfile);
        } else {
          const emptyProfile = createEmptyCreatorProfile(user.id);
          
          // Add avatar URL from profiles table if available
          if (profileData?.avatar_url) {
            emptyProfile.avatarUrl = profileData.avatar_url;
          }
          
          setProfile(emptyProfile);
        }
      } catch (error) {
        console.error('Failed to fetch creator profile:', error);
        toast({
          description: 'Failed to load your profile. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorProfile();
  }, [user?.id]);

  return {
    profile,
    isLoading,
    setProfile
  };
};
