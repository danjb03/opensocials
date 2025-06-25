
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

export interface CreatorInvitation {
  id: string;
  project_id: string;
  project_name: string;
  brand_name?: string;
  company_name?: string;
  status: 'pending' | 'accepted' | 'declined' | 'invited';
  created_at: string;
  agreed_amount?: number;
  currency?: string;
}

export const useCreatorInvitations = () => {
  const [invitations, setInvitations] = useState<CreatorInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const { user } = useUnifiedAuth();

  const fetchInvitations = async () => {
    if (!user?.id) {
      setInvitations([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_creators')
        .select(`
          id,
          project_id,
          status,
          agreed_amount,
          currency,
          created_at,
          projects!inner (
            name,
            brand_profiles!inner (
              company_name
            )
          )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedInvitations = data?.map((inv: any) => ({
        id: inv.id,
        project_id: inv.project_id,
        project_name: inv.projects.name,
        brand_name: inv.projects.brand_profiles.company_name,
        company_name: inv.projects.brand_profiles.company_name,
        status: inv.status,
        created_at: inv.created_at,
        agreed_amount: inv.agreed_amount,
        currency: inv.currency || 'USD'
      })) || [];

      setInvitations(transformedInvitations);
    } catch (error) {
      console.error('Error fetching creator invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  const respondToInvitation = async (invitationId: string, response: 'accepted' | 'declined') => {
    setActionLoading(prev => ({ ...prev, [invitationId]: true }));
    
    try {
      const { error } = await supabase
        .from('project_creators')
        .update({ status: response })
        .eq('id', invitationId);

      if (error) throw error;

      await fetchInvitations();
      toast.success(`Invitation ${response} successfully`);
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast.error('Failed to respond to invitation');
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  const acceptInvitation = (invitationId: string) => {
    return respondToInvitation(invitationId, 'accepted');
  };

  const declineInvitation = (invitationId: string) => {
    return respondToInvitation(invitationId, 'declined');
  };

  useEffect(() => {
    fetchInvitations();
  }, [user?.id]);

  return {
    invitations,
    isLoading,
    actionLoading,
    acceptInvitation,
    declineInvitation,
    respondToInvitation,
    refetch: fetchInvitations
  };
};
