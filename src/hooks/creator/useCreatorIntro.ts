
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { checkIntro } from '@/utils/intro';

export const useCreatorIntro = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();

  useEffect(() => {
    const loadIntro = async () => {
      if (!user || role !== 'creator') {
        setIsLoading(false);
        return;
      }

      const shouldShow = await checkIntro('creator');
      setShowIntro(shouldShow);
      setIsLoading(false);
    };

    loadIntro();
  }, [user, role]);

  const dismissIntro = async () => {
    if (!user) {
      setShowIntro(false);
      return;
    }

    try {
      await supabase.functions.invoke('dismiss-intro', {
        body: { intro_type: 'creator' },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
    } catch (error) {
      console.error('Error dismissing creator intro:', error);
    } finally {
      setShowIntro(false);
    }
  };

  return {
    showIntro,
    isLoading,
    dismissIntro,
  };
};
