
import React, { createContext, useContext } from 'react';
import { useInsightIQData } from '@/hooks/useInsightIQData';

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
  const insightIQData = useInsightIQData();

  return (
    <InsightIQContext.Provider value={insightIQData}>
      {children}
    </InsightIQContext.Provider>
  );
};
