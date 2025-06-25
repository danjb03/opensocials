
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectParams {
  creator_id: string;
  platform: string;
  identifier: string;
}

interface UseInsightIQConnectReturn {
  connect: (params: ConnectParams) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export const useInsightIQConnect = (): UseInsightIQConnectReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async ({ creator_id, platform, identifier }: ConnectParams) => {
    // Safety check - don't execute if supabase isn't ready
    if (!supabase) {
      console.warn('Supabase client not ready, skipping connect');
      setError('Service temporarily unavailable');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'fetch-insightiq-profile',
        {
          body: {
            creator_id,
            platform: platform.toLowerCase(),
            identifier: identifier.trim(),
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message || 'Failed to connect profile');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to fetch profile data');
      }

      setIsSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('InsightIQ connect error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connect,
    isLoading,
    isSuccess,
    error,
  };
};
