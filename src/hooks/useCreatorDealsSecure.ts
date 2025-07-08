import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface Deal {
  id: string;
  project_id: string;
  creator_id: string;
  status: string;
  agreed_terms: string;
  created_at: string;
}

interface UseCreatorDealsReturn {
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
}

export const useCreatorDealsSecure = (): UseCreatorDealsReturn => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUnifiedAuth();

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('creator_id', user.id);

        if (error) {
          setError(error.message);
        } else {
          setDeals(data || []);
        }
      } catch (err) {
        setError('Failed to fetch deals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [user?.id]);

  return {
    deals,
    isLoading,
    error,
  };
};

