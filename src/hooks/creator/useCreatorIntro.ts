import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export const useCreatorIntro = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();

  useEffect(() => {
    const checkCreatorIntro = async () => {
      if (!user || role !== 'creator') {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-creator-intro', {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });

        if (error) {
          console.error('Error checking creator intro:', error);
          setIsLoading(false);
          return;
        }

        setShowIntro(data?.showIntro || false);
      } catch (error) {
        console.error('Error checking creator intro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkCreatorIntro();
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
