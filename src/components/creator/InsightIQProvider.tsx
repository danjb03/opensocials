
import React, { createContext, useContext } from 'react';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';

interface InsightIQData {
  followers: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  avg_views: number;
  growth_rate: number;
  verified: boolean;
  profile_picture?: string;
  bio?: string;
}

interface PlatformData {
  [platform: string]: {
    username: string;
    data?: InsightIQData;
    isLoading: boolean;
    error?: string;
  };
}

interface InsightIQContextType {
  platformData: PlatformData;
  fetchCreatorData: (platform: string, username: string) => Promise<void>;
  clearPlatformData: (platform: string) => void;
  getPlatformData: (platform: string) => PlatformData[string] | undefined;
}

const InsightIQContext = createContext<InsightIQContextType | undefined>(undefined);

export const useInsightIQContext = () => {
  const context = useContext(InsightIQContext);
  if (!context) {
    throw new Error('useInsightIQContext must be used within an InsightIQProvider');
  }
  return context;
};

interface InsightIQProviderProps {
  children: React.ReactNode;
}

export const InsightIQProvider: React.FC<InsightIQProviderProps> = ({ children }) => {
  const { user } = useCreatorAuth();
  const { data: analyticsData, isLoading } = useInsightIQData(user?.id || '');

  // Transform new analytics data to legacy format
  const platformData: PlatformData = {};
  
  if (analyticsData) {
    analyticsData.forEach(analytics => {
      platformData[analytics.platform] = {
        username: analytics.identifier,
        isLoading: false,
        data: {
          followers: analytics.follower_count || 0,
          engagement_rate: analytics.engagement_rate || 0,
          avg_likes: analytics.average_likes || 0,
          avg_comments: analytics.average_comments || 0,
          avg_views: analytics.average_views || 0,
          growth_rate: 0, // Not available in new API
          verified: analytics.is_verified || false,
          profile_picture: analytics.image_url,
          bio: analytics.introduction,
        }
      };
    });
  }

  const fetchCreatorData = async (platform: string, username: string) => {
    // This is handled by the new SocialPlatformConnect component
    console.log('Use SocialPlatformConnect component instead');
  };

  const clearPlatformData = (platform: string) => {
    // Legacy function - not needed with new implementation
    console.log('Platform data clearing not needed with new implementation');
  };

  const getPlatformData = (platform: string) => {
    return platformData[platform];
  };

  const contextValue: InsightIQContextType = {
    platformData,
    fetchCreatorData,
    clearPlatformData,
    getPlatformData,
  };

  return (
    <InsightIQContext.Provider value={contextValue}>
      {children}
    </InsightIQContext.Provider>
  );
};
