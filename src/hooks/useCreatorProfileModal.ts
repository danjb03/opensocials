
import { useState, useEffect } from 'react';
import { Creator } from '@/types/creator';
import { mockCreatorsBase } from '@/data/mockCreators';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

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
        .eq('id', creatorId)
        .single();

      if (profileData) {
        // Use real data from database
        const enhancedCreator = {
          id: profileData.id,
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          platform: profileData.primary_platform || 'Instagram',
          audience: profileData.audience_type || 'General',
          contentType: profileData.content_type || 'Lifestyle',
          followers: profileData.follower_count || '0',
          engagement: profileData.engagement_rate || '0%',
          priceRange: profileData.price_range || '$500-$1000',
          skills: profileData.skills || [],
          imageUrl: profileData.avatar_url || 'https://via.placeholder.com/150',
          bannerImageUrl: profileData.banner_image_url,
          about: profileData.bio || 'No bio available',
          socialLinks: profileData.social_links || {},
          metrics: {
            followerCount: profileData.follower_count || '0',
            engagementRate: profileData.engagement_rate || '0%',
            avgViews: profileData.average_views || '0 views',
            avgLikes: profileData.average_likes || '0 likes',
          },
          audienceLocation: profileData.audience_location || {
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
          const enhancedCreator = {
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
