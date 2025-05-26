
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

export interface CreatorInvitation {
  id: string;
  brand_id: string;
  status: 'invited' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  brand_name?: string;
  company_name?: string;
}

export function useCreatorInvitations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<CreatorInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Fetch invitations for the current creator
  const fetchInvitations = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('brand_creator_connections')
        .select(`
          id,
          brand_id,
          status,
          created_at,
          updated_at,
          profiles!brand_creator_connections_brand_id_fkey (
            company_name,
            display_name
          )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInvitations: CreatorInvitation[] = data.map(item => ({
        id: item.id,
        brand_id: item.brand_id,
        status: item.status as 'invited' | 'accepted' | 'declined',
        created_at: item.created_at,
        updated_at: item.updated_at,
        brand_name: (item.profiles as any)?.display_name || (item.profiles as any)?.company_name,
        company_name: (item.profiles as any)?.company_name,
      }));

      setInvitations(formattedInvitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Accept an invitation
  const acceptInvitation = async (invitationId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [invitationId]: true }));

      const { error } = await supabase
        .from('brand_creator_connections')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      // Update local state
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: 'accepted' as const, updated_at: new Date().toISOString() }
            : inv
        )
      );

      toast({
        title: "Invitation accepted",
        description: "You've successfully accepted the campaign invitation!",
      });

    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  // Decline an invitation
  const declineInvitation = async (invitationId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [invitationId]: true }));

      const { error } = await supabase
        .from('brand_creator_connections')
        .update({ 
          status: 'declined',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      // Update local state
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: 'declined' as const, updated_at: new Date().toISOString() }
            : inv
        )
      );

      toast({
        title: "Invitation declined",
        description: "You've declined the campaign invitation.",
      });

    } catch (error) {
      console.error('Error declining invitation:', error);
      toast({
        title: "Error",
        description: "Failed to decline invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [invitationId]: false }));
    }
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
    refetchInvitations: fetchInvitations,
  };
}
