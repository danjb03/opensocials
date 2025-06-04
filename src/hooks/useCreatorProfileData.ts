
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
          // Transform the data to match CreatorProfileRecord interface
          const transformedData = {
            user_id: creatorData.user_id,
            display_name: creatorData.first_name && creatorData.last_name 
              ? `${creatorData.first_name} ${creatorData.last_name}` 
              : creatorData.username || null,
            bio: creatorData.bio,
            follower_count: creatorData.follower_count,
            engagement_rate: creatorData.engagement_rate,
            primary_platform: creatorData.primary_platform,
            content_type: creatorData.content_type,
            audience_type: creatorData.audience_type,
            audience_location: typeof creatorData.audience_location === 'string' 
              ? creatorData.audience_location 
              : JSON.stringify(creatorData.audience_location || {}),
            creator_type: creatorData.creator_type,
            industries: creatorData.industries,
            categories: creatorData.content_types,
            platform_types: creatorData.platforms,
            social_links: creatorData.social_handles || null,
            audience_stats: null,
            headline: null,
            rate_card_url: null,
            created_at: creatorData.created_at,
            updated_at: creatorData.updated_at
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
