
import React, { createContext, useContext } from 'react';

// Legacy provider - kept for compatibility but no longer used
// All functionality has been moved to useInsightIQData and useInsightIQConnect hooks

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
    throw new Error('useInsightIQContext must be used within an InsightIQProvider - this provider is deprecated, use useInsightIQData and useInsightIQConnect instead');
  }
  return context;
};

interface InsightIQProviderProps {
  children: React.ReactNode;
}

export const InsightIQProvider: React.FC<InsightIQProviderProps> = ({ children }) => {
  // Legacy provider - no longer functional
  // Use useInsightIQData and useInsightIQConnect hooks instead
  
  const platformData: PlatformData = {};

  const fetchCreatorData = async (platform: string, username: string) => {
    console.warn('InsightIQProvider is deprecated. Use useInsightIQConnect hook instead.');
  };

  const clearPlatformData = (platform: string) => {
    console.warn('InsightIQProvider is deprecated. Use useInsightIQData hook instead.');
  };

  const getPlatformData = (platform: string) => {
    console.warn('InsightIQProvider is deprecated. Use useInsightIQData hook instead.');
    return undefined;
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
