
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCreatorData = () => {
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);

  const fetchCreatorProfile = async (userId: string) => {
    setIsLoadingCreator(true);
    
    try {
      // Fetch creator profile with analytics data
      const { data: creatorData, error: creatorError } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('creator_public_analytics')
        .select('*')
        .eq('creator_id', userId)
        .order('fetched_at', { ascending: false })
        .limit(1);

      return {
        creatorData,
        analyticsData: analyticsData?.[0] || null,
        creatorError,
        analyticsError
      };
    } catch (error) {
      console.error('Error fetching creator data:', error);
      return {
        creatorData: null,
        analyticsData: null,
        creatorError: error,
        analyticsError: null
      };
    } finally {
      setIsLoadingCreator(false);
    }
  };

  return {
    fetchCreatorProfile,
    isLoadingCreator
  };
};
