
import { useState } from 'react';
import { Creator } from '@/types/creator';
import { mockCreatorsBase } from '@/data/mockCreators';

export const useCreatorProfileModal = () => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);

  const handleViewCreatorProfile = (creatorId: number) => {
    setIsLoadingCreator(true);
    setIsProfileModalOpen(true);
    
    // Simulate loading of additional creator details
    setTimeout(() => {
      const creator = mockCreatorsBase.find(c => c.id === creatorId);
      if (creator) {
        // In a real app, we would fetch additional details here
        // For now, we'll just simulate some data
        const enhancedCreator = {
          ...creator,
          about: `Hi, I'm ${creator.name}! I'm a content creator specializing in ${creator.contentType} content for ${creator.audience} audiences. I love creating engaging content that resonates with my followers.`,
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
      setIsLoadingCreator(false);
    }, 1000);
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
