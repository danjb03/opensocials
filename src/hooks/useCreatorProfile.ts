
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

    // Type the raw profile properly to access database fields
    const dbProfile = rawProfile as any;

    return {
      firstName: dbProfile.first_name,
      lastName: dbProfile.last_name,
      bio: dbProfile.bio,
      primaryPlatform: dbProfile.primary_platform,
      contentType: dbProfile.content_types?.[0] || null,
      audienceType: null, // Field doesn't exist in database
      audienceLocation: dbProfile.audience_location || { primary: 'Global' },
      industries: dbProfile.industries || null,
      creatorType: null, // Field doesn't exist in database
      isProfileComplete: dbProfile.is_profile_complete || false,
      platforms: dbProfile.platforms || [],
      contentTypes: dbProfile.content_types || [],
      socialConnections: {
        instagram: !!dbProfile.social_handles?.instagram,
        tiktok: !!dbProfile.social_handles?.tiktok,
        youtube: !!dbProfile.social_handles?.youtube,
        linkedin: !!dbProfile.social_handles?.linkedin,
      },
      socialHandles: dbProfile.social_handles || {},
      followerCount: dbProfile.follower_count?.toString() || '0', // Convert to string
      engagementRate: dbProfile.engagement_rate?.toString() || '0', // Convert to string
      avatarUrl: dbProfile.avatar_url,
      bannerUrl: dbProfile.banner_url
    };
  }, [rawProfile]);

  return {
    profile,
    isLoading
  };
};
