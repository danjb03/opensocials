
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export const useBrandIntro = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();

  useEffect(() => {
    const checkBrandIntro = async () => {
      if (!user || role !== 'brand') {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-brand-intro', {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });

        if (error) {
          console.error('Error checking brand intro:', error);
          setIsLoading(false);
          return;
        }

        setShowIntro(data?.showIntro || false);
      } catch (error) {
        console.error('Error checking brand intro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBrandIntro();
  }, [user, role]);

  const dismissIntro = () => {
    setShowIntro(false);
  };

  return {
    showIntro,
    isLoading,
    dismissIntro,
  };
};
