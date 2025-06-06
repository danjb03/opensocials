
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectCreatorInvitation } from '@/types/projectCreator';

export const useProjectCreators = (projectId: string) => {
  return useQuery({
    queryKey: ['project-creators', projectId],
    queryFn: async (): Promise<ProjectCreatorInvitation[]> => {
      const { data, error } = await supabase
        .from('project_creators')
        .select(`
          id,
          project_id,
          creator_id,
          status,
          agreed_amount,
          currency,
          payment_structure,
          content_requirements,
          invitation_date,
          response_date,
          contract_signed_date,
          submitted_content_count,
          approved_content_count,
          notes,
          profiles!project_creators_creator_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          creator_profiles!creator_profiles_user_id_fkey (
            primary_platform
          )
        `)
        .eq('project_id', projectId)
        .order('invitation_date', { ascending: false });

      if (error) {
        console.error('Error fetching project creators:', error);
        throw error;
      }

      return data?.map((pc: any) => ({
        id: pc.id,
        projectId: pc.project_id,
        creatorId: pc.creator_id,
        status: pc.status,
        agreedAmount: pc.agreed_amount,
        currency: pc.currency,
        paymentStructure: pc.payment_structure,
        contentRequirements: pc.content_requirements,
        invitationDate: pc.invitation_date,
        responseDate: pc.response_date,
        contractSignedDate: pc.contract_signed_date,
        submittedContentCount: pc.submitted_content_count,
        approvedContentCount: pc.approved_content_count,
        notes: pc.notes,
        creatorProfile: {
          id: pc.profiles?.id,
          fullName: pc.profiles ? `${pc.profiles.first_name || ''} ${pc.profiles.last_name || ''}`.trim() : '',
          avatarUrl: pc.profiles?.avatar_url,
          primaryPlatform: pc.creator_profiles?.primary_platform,
        },
      })) || [];
    },
    enabled: !!projectId,
  });
};
