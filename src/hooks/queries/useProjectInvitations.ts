import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

export interface ProjectInvitation {
  id: string;
  project_id: string;
  project_name: string;
  brand_name: string;
  status: 'invited' | 'accepted' | 'declined' | 'contracted' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
  agreed_amount?: number;
  currency: string;
  content_requirements?: any;
  notes?: string;
  invitation_date: string;
  response_date?: string;
}

export const useProjectInvitations = () => {
  const { user } = useUnifiedAuth();

  return useQuery({
    queryKey: ['project-invitations', user?.id],
    queryFn: async (): Promise<ProjectInvitation[]> => {
      if (!user?.id) return [];

      console.log('🎯 Fetching project invitations for user:', user.id);

      const { data, error } = await supabase
        .from('project_creators')
        .select(`
          id,
          project_id,
          status,
          agreed_amount,
          currency,
          content_requirements,
          notes,
          invitation_date,
          response_date,
          projects_new!inner (
            name,
            brand_profiles!inner (
              company_name
            )
          )
        `)
        .eq('creator_id', user.id)
        .order('invitation_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching project invitations:', error);
        throw error;
      }

      console.log('✅ Raw project invitations data:', data);

      const invitations = data?.map((invitation: any) => ({
        id: invitation.id,
        project_id: invitation.project_id,
        project_name: invitation.projects_new.name,
        brand_name: invitation.projects_new.brand_profiles.company_name,
        status: invitation.status,
        agreed_amount: invitation.agreed_amount,
        currency: invitation.currency,
        content_requirements: invitation.content_requirements,
        notes: invitation.notes,
        invitation_date: invitation.invitation_date,
        response_date: invitation.response_date,
      })) || [];

      console.log('🎯 Processed project invitations:', invitations);
      return invitations;
    },
    enabled: !!user?.id,
  });
};
