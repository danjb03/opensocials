
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CreatorProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  primaryPlatform: string;
  contentType: string;
  audienceType: string;
  followerCount: string;
  engagementRate: string;
  isProfileComplete: boolean;
  socialConnections: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    linkedin: boolean;
  };
  visibilitySettings: {
    showInstagram: boolean;
    showTiktok: boolean;
    showYoutube: boolean;
    showLinkedin: boolean;
    showLocation: boolean;
    showAnalytics: boolean;
  };
  audienceLocation: {
    primary: string;
    secondary?: string[];
    countries?: { name: string; percentage: number }[];
  };
  industries?: string[];
  creatorType?: string;
}

interface ExtendedProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio?: string | null;
  avatar_url: string | null;
  banner_url?: string | null;
  primary_platform?: string | null;
  content_type?: string | null;
  audience_type?: string | null;
  follower_count?: string | null;
  engagement_rate?: string | null;
  is_profile_complete?: boolean | null;
  instagram_connected?: boolean | null;
  tiktok_connected?: boolean | null;
  youtube_connected?: boolean | null;
  linkedin_connected?: boolean | null;
  show_instagram?: boolean | null;
  show_tiktok?: boolean | null;
  show_youtube?: boolean | null;
  show_linkedin?: boolean | null;
  show_location?: boolean | null;
  show_analytics?: boolean | null;
  audience_location?: any | null;
  industries?: string[] | null;
  creator_type?: string | null;
}

export const useCreatorProfileData = () => {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const transformProfile = (data: ExtendedProfile): CreatorProfile => {
    return {
      id: data.id,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      bio: data.bio || '',
      avatarUrl: data.avatar_url,
      bannerUrl: data.banner_url || null,
      primaryPlatform: data.primary_platform || '',
      contentType: data.content_type || '',
      audienceType: data.audience_type || '',
      followerCount: data.follower_count || '0',
      engagementRate: data.engagement_rate || '0%',
      isProfileComplete: Boolean(data.is_profile_complete),
      socialConnections: {
        instagram: Boolean(data.instagram_connected),
        tiktok: Boolean(data.tiktok_connected),
        youtube: Boolean(data.youtube_connected),
        linkedin: Boolean(data.linkedin_connected)
      },
      visibilitySettings: {
        showInstagram: data.show_instagram !== false,
        showTiktok: data.show_tiktok !== false,
        showYoutube: data.show_youtube !== false,
        showLinkedin: data.show_linkedin !== false,
        showLocation: data.show_location !== false,
        showAnalytics: data.show_analytics !== false
      },
      audienceLocation: data.audience_location || {
        primary: 'Global',
        secondary: [],
        countries: [
          { name: 'United States', percentage: 30 },
          { name: 'United Kingdom', percentage: 20 },
          { name: 'Canada', percentage: 15 },
          { name: 'Australia', percentage: 10 },
          { name: 'Others', percentage: 25 }
        ]
      },
      industries: data.industries || [],
      creatorType: data.creator_type || ''
    };
  };

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            description: 'Failed to load creator profile',
            variant: 'destructive'
          });
          return;
        }

        if (data) {
          const transformedProfile = transformProfile(data as unknown as ExtendedProfile);
          setProfile(transformedProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          description: 'Failed to load creator profile',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, toast]);

  return { 
    profile, 
    isLoading, 
    setProfile: (updater: (prev: CreatorProfile | null) => CreatorProfile | null) => setProfile(updater)
  };
};
