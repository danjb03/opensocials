
import { CreatorProfile, CreatorProfileRecord } from '@/types/creatorProfile';

export const transformCreatorProfile = (data: CreatorProfileRecord): CreatorProfile => {
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

export const createEmptyCreatorProfile = (userId: string): CreatorProfile => {
  return {
    id: userId,
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
  };
};
