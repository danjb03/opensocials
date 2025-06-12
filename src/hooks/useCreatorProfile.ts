
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
      audienceType: rawProfile.audience_type || null,
      audienceLocation: rawProfile.audience_location || { primary: 'Global' },
      industries: rawProfile.industries || null,
      creatorType: rawProfile.creator_type || null,
      isProfileComplete: rawProfile.is_profile_complete || false,
      socialConnections: {
        instagram: !!rawProfile.social_handles?.instagram,
        tiktok: !!rawProfile.social_handles?.tiktok,
        youtube: !!rawProfile.social_handles?.youtube,
        linkedin: !!rawProfile.social_handles?.linkedin,
      }
    };
  }, [rawProfile]);

  return {
    profile,
    isLoading
  };
};
