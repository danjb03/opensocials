
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProjectCreatorInvitation {
  id: string;
  projectId: string;
  creatorId: string;
  status: 'invited' | 'accepted' | 'declined' | 'contracted' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
  agreedAmount?: number;
  currency: string;
  paymentStructure?: any;
  contentRequirements?: any;
  invitationDate: string;
  responseDate?: string;
  contractSignedDate?: string;
  submittedContentCount: number;
  approvedContentCount: number;
  notes?: string;
  creatorProfile?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    primaryPlatform?: string;
  };
}

// Fetch project creators
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

// Invite creator to project
export const useInviteCreatorToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      creatorId,
      agreedAmount,
      currency = 'USD',
      paymentStructure,
      contentRequirements,
      notes,
    }: {
      projectId: string;
      creatorId: string;
      agreedAmount?: number;
      currency?: string;
      paymentStructure?: any;
      contentRequirements?: any;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_creators')
        .insert({
          project_id: projectId,
          creator_id: creatorId,
          status: 'invited',
          agreed_amount: agreedAmount,
          currency,
          payment_structure: paymentStructure,
          content_requirements: contentRequirements,
          notes,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inviting creator:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Creator invited successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creators', data.project_id] });
    },
    onError: (error) => {
      console.error('Failed to invite creator:', error);
      toast.error('Failed to invite creator. Please try again.');
    },
  });
};

// Update creator invitation status
export const useUpdateCreatorInvitationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectCreatorId,
      status,
      responseDate,
      contractSignedDate,
    }: {
      projectCreatorId: string;
      status: 'accepted' | 'declined' | 'contracted' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
      responseDate?: string;
      contractSignedDate?: string;
    }) => {
      const updateData: any = {
        status,
        response_date: responseDate || (status !== 'invited' ? new Date().toISOString() : undefined),
      };

      if (contractSignedDate) {
        updateData.contract_signed_date = contractSignedDate;
      }

      const { data, error } = await supabase
        .from('project_creators')
        .update(updateData)
        .eq('id', projectCreatorId)
        .select()
        .single();

      if (error) {
        console.error('Error updating creator status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Creator status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creators', data.project_id] });
    },
    onError: (error) => {
      console.error('Failed to update creator status:', error);
      toast.error('Failed to update creator status. Please try again.');
    },
  });
};

// Remove creator from project
export const useRemoveCreatorFromProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectCreatorId: string) => {
      const { error } = await supabase
        .from('project_creators')
        .delete()
        .eq('id', projectCreatorId);

      if (error) {
        console.error('Error removing creator:', error);
        throw error;
      }

      return projectCreatorId;
    },
    onSuccess: () => {
      toast.success('Creator removed successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creators'] });
    },
    onError: (error) => {
      console.error('Failed to remove creator:', error);
      toast.error('Failed to remove creator. Please try again.');
    },
  });
};
