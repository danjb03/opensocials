
import { useState, useEffect } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { checkIntro } from '@/utils/intro';

export const useBrandIntro = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useUnifiedAuth();

  useEffect(() => {
    const loadIntro = async () => {
      if (!user || role !== 'brand') {
        setIsLoading(false);
        return;
      }

      const shouldShow = await checkIntro('brand');
      setShowIntro(shouldShow);
      setIsLoading(false);
    };

    loadIntro();
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
