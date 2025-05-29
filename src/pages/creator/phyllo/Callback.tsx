import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { getRedirectData, clearRedirectData } from '@/utils/phylloRedirectData';

const PhylloCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finalizeConnection = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const err = params.get('error');

      if (err) {
        toast.error('Failed to connect social account.');
        clearRedirectData();
        navigate('/creator/profile/setup', { replace: true });
        return;
      }

      if (!code || !state) {
        toast.error('Invalid callback parameters.');
        clearRedirectData();
        navigate('/creator/profile/setup', { replace: true });
        return;
      }

      const redirectData = getRedirectData();
      if (!redirectData) {
        toast.error('Session expired. Please try again.');
        navigate('/creator/profile/setup', { replace: true });
        return;
      }

      const { error: fnError } = await supabase.functions.invoke('phyllo-callback', {
        body: { code, state, platform: redirectData.platform }
      });

      clearRedirectData();

      if (fnError) {
        toast.error('Failed to connect account.');
        navigate('/creator/profile/setup', { replace: true });
        return;
      }

      toast.success('Account connected successfully!');
      navigate('/creator/dashboard', { replace: true });
    };

    finalizeConnection();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Processing Connection</p>
          <p className="text-muted-foreground">Please wait while we connect your account...</p>
        </div>
      </div>
    </div>
  );
};

export default PhylloCallback;
