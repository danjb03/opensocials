
import { useMemo } from 'react';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { useInsightIQData } from '@/hooks/useInsightIQData';

export interface CreatorProfile {
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  primaryPlatform: string | null;
  contentType: string | null;
  audienceType: string | null;
  audienceLocation: {
    primary: string;
    secondary?: string[];
    countries?: { name: string; percentage: number }[];
  } | null;
  industries: string[] | null;
  creatorType: string | null;
  isProfileComplete: boolean;
  socialConnections?: {
    instagram?: boolean;
    tiktok?: boolean;
    youtube?: boolean;
    linkedin?: boolean;
  };
  platforms?: string[];
  contentTypes?: string[];
  socialHandles?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
  };
  followerCount?: string;
  engagementRate?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  completion?: number;
}

export const useCreatorProfile = () => {
  const { user, profile: rawProfile, isLoading: authLoading } = useCreatorAuth();
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useInsightIQData(user?.id || '');

  const profile = useMemo((): CreatorProfile | null => {
    if (!user) return null;

    // Type the raw profile properly to access database fields
    const dbProfile = rawProfile as any;

    // Check if user has connected social profiles
    const hasConnectedSocials = analyticsData && analyticsData.length > 0;
    
    // Determine if profile is complete based on social connections OR database profile completion
    const isProfileComplete = hasConnectedSocials || (dbProfile?.is_profile_complete === true);

    // Build social connections based on analytics data
    const socialConnections = {
      instagram: analyticsData?.some(data => data.platform === 'instagram') || false,
      tiktok: analyticsData?.some(data => data.platform === 'tiktok') || false,
      youtube: analyticsData?.some(data => data.platform === 'youtube') || false,
      linkedin: analyticsData?.some(data => data.platform === 'linkedin') || false,
    };

    // Build social handles from analytics data
    const socialHandles: { [key: string]: string } = {};
    analyticsData?.forEach(data => {
      if (data.platform && data.identifier) {
        socialHandles[data.platform] = data.identifier;
      }
    });

    // Calculate completion percentage
    let completion = 0;
    if (dbProfile?.first_name) completion += 20;
    if (dbProfile?.last_name) completion += 20;
    if (dbProfile?.bio) completion += 20;
    if (dbProfile?.industries?.length > 0) completion += 20;
    if (hasConnectedSocials) completion += 20;

    return {
      firstName: dbProfile?.first_name || null,
      lastName: dbProfile?.last_name || null,
      bio: dbProfile?.bio || null,
      primaryPlatform: dbProfile?.primary_platform || (analyticsData?.[0]?.platform) || null,
      contentType: dbProfile?.content_types?.[0] || null,
      audienceType: null,
      audienceLocation: dbProfile?.audience_location || { primary: 'Global' },
      industries: dbProfile?.industries || null,
      creatorType: null,
      isProfileComplete,
      platforms: dbProfile?.platforms || [],
      contentTypes: dbProfile?.content_types || [],
      socialConnections,
      socialHandles,
      followerCount: analyticsData?.[0]?.follower_count?.toString() || dbProfile?.follower_count?.toString() || '0',
      engagementRate: analyticsData?.[0]?.engagement_rate?.toString() || dbProfile?.engagement_rate?.toString() || '0',
      avatarUrl: dbProfile?.avatar_url,
      bannerUrl: dbProfile?.banner_url,
      completion
    };
  }, [rawProfile, analyticsData, user]);

  return {
    profile,
    isLoading: authLoading || analyticsLoading,
    error: analyticsError
  };
};
