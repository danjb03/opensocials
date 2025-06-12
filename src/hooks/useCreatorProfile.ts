
import { useMemo } from 'react';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';

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
  followerCount?: string; // Changed to string to match types/creatorProfile.ts
  engagementRate?: string; // Changed to string to match types/creatorProfile.ts
  avatarUrl?: string | null;
  bannerUrl?: string | null;
}

export const useCreatorProfile = () => {
  const { profile: rawProfile, isLoading } = useCreatorAuth();

  const profile = useMemo((): CreatorProfile | null => {
    if (!rawProfile) return null;

    return {
      firstName: rawProfile.first_name,
      lastName: rawProfile.last_name,
      bio: rawProfile.bio,
      primaryPlatform: rawProfile.primary_platform,
      contentType: rawProfile.content_types?.[0] || null,
      audienceType: null, // Field doesn't exist in database
      audienceLocation: rawProfile.audience_location || { primary: 'Global' },
      industries: rawProfile.industries || null,
      creatorType: null, // Field doesn't exist in database
      isProfileComplete: rawProfile.is_profile_complete || false,
      platforms: rawProfile.platforms || [],
      contentTypes: rawProfile.content_types || [],
      socialConnections: {
        instagram: !!rawProfile.social_handles?.instagram,
        tiktok: !!rawProfile.social_handles?.tiktok,
        youtube: !!rawProfile.social_handles?.youtube,
        linkedin: !!rawProfile.social_handles?.linkedin,
      },
      socialHandles: rawProfile.social_handles || {},
      followerCount: rawProfile.follower_count?.toString() || '0', // Convert to string
      engagementRate: rawProfile.engagement_rate?.toString() || '0', // Convert to string
      avatarUrl: rawProfile.avatar_url,
      bannerUrl: rawProfile.banner_url
    };
  }, [rawProfile]);

  return {
    profile,
    isLoading
  };
};
