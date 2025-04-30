
import { useState, useEffect } from 'react';
import { Creator } from '@/types/creator';
import { mockCreatorsBase } from '@/data/mockCreators';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Define an extended profile type for the Supabase data
interface ExtendedProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio?: string | null;
  avatar_url: string | null;
  banner_image_url?: string | null;
  primary_platform?: string | null;
  audience_type?: string | null;
  content_type?: string | null;
  follower_count?: string | null;
  engagement_rate?: string | null;
  price_range?: string | null;
  skills?: string[] | null;
  social_links?: any | null;
  average_views?: string | null;
  average_likes?: string | null;
  audience_location?: any | null;
}

export const useCreatorProfileModal = () => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleViewCreatorProfile = async (creatorId: number) => {
    setIsLoadingCreator(true);
    setIsProfileModalOpen(true);
    
    try {
      // First check if this creator exists in supabase
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', creatorId.toString())
        .single();

      if (profileData) {
        // Cast data to our extended profile type
        const profile = profileData as unknown as ExtendedProfile;
        
        // Use real data from database
        const enhancedCreator: Creator = {
          id: Number(profile.id),
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          platform: profile.primary_platform || 'Instagram',
          audience: profile.audience_type || 'General',
          contentType: profile.content_type || 'Lifestyle',
          followers: profile.follower_count || '0',
          engagement: profile.engagement_rate || '0%',
          priceRange: profile.price_range || '$500-$1000',
          skills: profile.skills || [],
          imageUrl: profile.avatar_url || 'https://via.placeholder.com/150',
          bannerImageUrl: profile.banner_image_url,
          about: profile.bio || 'No bio available',
          socialLinks: profile.social_links || {},
          metrics: {
            followerCount: profile.follower_count || '0',
            engagementRate: profile.engagement_rate || '0%',
            avgViews: profile.average_views || '0 views',
            avgLikes: profile.average_likes || '0 likes',
          },
          audienceLocation: profile.audience_location || {
            primary: 'United States',
            secondary: ['Canada', 'United Kingdom'],
            countries: [
              { name: 'United States', percentage: 60 },
              { name: 'Canada', percentage: 15 },
              { name: 'United Kingdom', percentage: 10 },
              { name: 'Others', percentage: 15 }
            ]
          }
        };
        setSelectedCreator(enhancedCreator);
      } else {
        // Fall back to mock data
        const creator = mockCreatorsBase.find(c => c.id === creatorId);
        if (creator) {
          const enhancedCreator: Creator = {
            ...creator,
            about: `Hi, I'm ${creator.name}! I'm a content creator specializing in ${creator.contentType} content for ${creator.audience} audiences.`,
            socialLinks: {
              instagram: 'https://instagram.com',
              tiktok: creator.platform === 'TikTok' ? 'https://tiktok.com' : undefined,
              youtube: creator.platform === 'YouTube' ? 'https://youtube.com' : undefined,
              twitter: 'https://twitter.com',
            },
            metrics: {
              followerCount: creator.followers,
              engagementRate: creator.engagement,
              avgViews: `${Math.floor(parseInt(creator.followers.replace(/[^0-9]/g, '')) * 0.3).toLocaleString()} views`,
              avgLikes: `${Math.floor(parseInt(creator.followers.replace(/[^0-9]/g, '')) * 0.08).toLocaleString()} likes`,
            },
            audienceLocation: {
              primary: creator.id % 3 === 0 ? 'United States' : creator.id % 3 === 1 ? 'United Kingdom' : 'Global',
              secondary: creator.id % 2 === 0 ? ['Canada', 'Australia', 'Germany'] : ['Mexico', 'Brazil', 'India'],
              countries: [
                { name: 'United States', percentage: creator.id % 3 === 0 ? 65 : 30 },
                { name: 'United Kingdom', percentage: creator.id % 3 === 1 ? 58 : 15 },
                { name: 'Canada', percentage: 10 },
                { name: 'Australia', percentage: 8 },
                { name: 'Others', percentage: creator.id % 3 === 2 ? 40 : 7 }
              ]
            }
          };
          setSelectedCreator(enhancedCreator);
        }
      }
    } catch (error) {
      console.error('Error fetching creator:', error);
      toast({
        title: 'Error',
        description: 'Failed to load creator profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingCreator(false);
    }
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setTimeout(() => {
      setSelectedCreator(null);
    }, 300); // Wait for the dialog close animation
  };

  return {
    selectedCreator,
    isProfileModalOpen,
    isLoadingCreator,
    handleViewCreatorProfile,
    handleCloseProfileModal
  };
};
