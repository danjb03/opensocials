
import React, { createContext, useContext } from 'react';
import { useInsightIQData } from '@/hooks/useInsightIQData';

interface InsightIQContextType {
  platformData: any;
  fetchCreatorData: (platform: string, username: string) => Promise<void>;
  clearPlatformData: (platform: string) => void;
  getPlatformData: (platform: string) => any;
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
