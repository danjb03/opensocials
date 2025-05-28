
import { useState, useEffect, useRef } from 'react';
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

interface CreatorProfileRecord {
  user_id: string;
  display_name: string | null;
  bio?: string | null;
  follower_count?: number | null;
  engagement_rate?: number | null;
  primary_platform?: string | null;
  content_type?: string | null;
  audience_type?: string | null;
  audience_location?: string | null;
  creator_type?: string | null;
  industries?: string[] | null;
  categories?: string[] | null;
  platform_types?: string[] | null;
  social_links?: any | null;
  audience_stats?: any | null;
  headline?: string | null;
  rate_card_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export const useCreatorProfileData = () => {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const fetchedRef = useRef(false);

  const transformProfile = (data: CreatorProfileRecord): CreatorProfile => {
    console.log('Transforming creator profile data:', data);
    
    // Parse display name or use empty strings
    const displayName = data.display_name || '';
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check if profile is complete based on required fields
    const hasBasicInfo = Boolean(firstName && lastName);
    const hasPlatform = Boolean(data.primary_platform && data.primary_platform.trim());
    const hasContentType = Boolean(data.content_type && data.content_type.trim());
    const hasIndustries = Boolean(data.industries && data.industries.length > 0);
    const hasCreatorType = Boolean(data.creator_type && data.creator_type.trim());
    
    const isComplete = hasBasicInfo && hasPlatform && hasContentType && hasIndustries && hasCreatorType;
    
    console.log('Profile completion check:', {
      hasBasicInfo,
      hasPlatform,
      hasContentType,
      hasIndustries,
      hasCreatorType,
      isComplete
    });

    return {
      id: data.user_id,
      firstName,
      lastName,
      bio: data.bio || '',
      avatarUrl: null, // Not stored in creator_profiles
      bannerUrl: null, // Not stored in creator_profiles
      primaryPlatform: data.primary_platform || '',
      contentType: data.content_type || '',
      audienceType: data.audience_type || '',
      followerCount: data.follower_count?.toString() || '0',
      engagementRate: data.engagement_rate ? `${data.engagement_rate}%` : '0%',
      isProfileComplete: isComplete,
      socialConnections: {
        instagram: false, // Will need to be handled separately if needed
        tiktok: false,
        youtube: false,
        linkedin: false
      },
      visibilitySettings: {
        showInstagram: true,
        showTiktok: true,
        showYoutube: true,
        showLinkedin: true,
        showLocation: true,
        showAnalytics: true
      },
      audienceLocation: {
        primary: data.audience_location || 'Global',
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
    if (!user?.id || fetchedRef.current) {
      if (!user?.id) {
        setIsLoading(false);
      }
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Fetching creator profile for user:', user.id);
        fetchedRef.current = true;
        
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching creator profile:', error);
          toast({
            description: 'Failed to load creator profile',
            variant: 'destructive'
          });
          return;
        }

        if (data) {
          console.log('Creator profile data received:', data);
          const transformedProfile = transformProfile(data as CreatorProfileRecord);
          console.log('Transformed profile:', transformedProfile);
          setProfile(transformedProfile);
        } else {
          // Create a basic profile structure for new users
          setProfile({
            id: user.id,
            firstName: '',
            lastName: '',
            bio: '',
            avatarUrl: null,
            bannerUrl: null,
            primaryPlatform: '',
            contentType: '',
            audienceType: '',
            followerCount: '0',
            engagementRate: '0%',
            isProfileComplete: false,
            socialConnections: {
              instagram: false,
              tiktok: false,
              youtube: false,
              linkedin: false
            },
            visibilitySettings: {
              showInstagram: true,
              showTiktok: true,
              showYoutube: true,
              showLinkedin: true,
              showLocation: true,
              showAnalytics: true
            },
            audienceLocation: {
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
            industries: [],
            creatorType: ''
          });
        }
      } catch (error) {
        console.error('Error fetching creator profile:', error);
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
