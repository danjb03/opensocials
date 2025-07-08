
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface InvitationResult {
  success: boolean;
  message: string;
}

export interface MockInvitation {
  id: string;
  brand_name: string;
  campaign_name: string;
  offer_amount: number;
  deadline: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const useInvitationSimulation = () => {
  const [invitationResult, setInvitationResult] = useState<InvitationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUnifiedAuth();

  const simulateInvitation = useCallback(async (email: string, role: string) => {
    setIsLoading(true);
    setInvitationResult(null);

    try {
      if (!user?.id) {
        throw new Error('User ID is missing.');
      }

      const { data, error } = await supabase.functions.invoke('simulate-invitation', {
        body: {
          email,
          role,
          inviter_id: user.id,
        },
      });

      if (error) {
        console.error('Function invoke error:', error);
        setInvitationResult({ success: false, message: error.message });
      } else if (data) {
        setInvitationResult({ success: data.success, message: data.message });
      } else {
        setInvitationResult({ success: false, message: 'No data received from function.' });
      }
    } catch (err) {
      const error = err as Error;
      console.error('Invitation simulation error:', error);
      setInvitationResult({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    simulateInvitation,
    invitationResult,
    isLoading,
  };
};
