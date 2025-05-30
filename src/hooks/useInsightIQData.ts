
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useInsightIQData = () => {
  const [platformData, setPlatformData] = useState<PlatformData>({});

  const fetchCreatorData = async (platform: string, username: string) => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    console.log(`Fetching ${platform} data for username: ${username}`);
    
    // Set loading state
    setPlatformData(prev => ({
      ...prev,
      [platform]: {
        username,
        isLoading: true,
        error: undefined,
        data: prev[platform]?.data // Keep existing data while loading
      }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('insightiq', {
        body: { platform: platform.toLowerCase(), username }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to fetch data');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch creator data');
      }

      console.log(`Successfully fetched ${platform} data:`, data.data);

      // Update with successful data
      setPlatformData(prev => ({
        ...prev,
        [platform]: {
          username,
          data: data.data,
          isLoading: false,
          error: undefined
        }
      }));

      toast.success(`${platform} data updated successfully!`);

    } catch (error) {
      console.error(`Error fetching ${platform} data:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Update with error state
      setPlatformData(prev => ({
        ...prev,
        [platform]: {
          username,
          isLoading: false,
          error: errorMessage,
          data: prev[platform]?.data // Keep existing data if any
        }
      }));

      toast.error(`Failed to fetch ${platform} data: ${errorMessage}`);
    }
  };

  const clearPlatformData = (platform: string) => {
    setPlatformData(prev => {
      const newData = { ...prev };
      delete newData[platform];
      return newData;
    });
  };

  const getPlatformData = (platform: string) => {
    return platformData[platform];
  };

  return {
    platformData,
    fetchCreatorData,
    clearPlatformData,
    getPlatformData
  };
};
