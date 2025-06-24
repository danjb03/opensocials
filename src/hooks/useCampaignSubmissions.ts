
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CampaignSubmission } from '@/types/campaignReview';

export const useCampaignSubmissions = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-submissions', campaignId],
    queryFn: async (): Promise<CampaignSubmission[]> => {
      const { data: submissions, error } = await supabase
        .from('campaign_submissions')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaign submissions:', error);
        throw error;
      }

      // Fetch creator info for each submission
      const submissionsWithCreators = await Promise.all(
        (submissions || []).map(async (submission) => {
          const { data: creator } = await supabase
            .from('creator_profiles')
            .select('id, user_id, first_name, last_name, avatar_url')
            .eq('user_id', submission.creator_id)
            .single();

          return {
            ...submission,
            creator_info: creator ? {
              id: creator.id,
              name: `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Creator',
              avatar_url: creator.avatar_url
            } : undefined
          };
        })
      );

      return submissionsWithCreators;
    },
    enabled: !!campaignId,
  });
};

export const useSubmitContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      contentData,
      submissionNotes
    }: {
      campaignId: string;
      contentData: any;
      submissionNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('campaign_submissions')
        .insert({
          campaign_id: campaignId,
          creator_id: (await supabase.auth.getUser()).data.user?.id,
          content_data: contentData,
          submission_notes: submissionNotes,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting content:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Content submitted for review');
      queryClient.invalidateQueries({ queryKey: ['campaign-submissions'] });
    },
    onError: (error) => {
      console.error('Failed to submit content:', error);
      toast.error('Failed to submit content');
    },
  });
};

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      action,
      feedbackText
    }: {
      submissionId: string;
      action: 'approve' | 'request_revision' | 'reject';
      feedbackText?: string;
    }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Create review record
      const { error: reviewError } = await supabase
        .from('submission_reviews')
        .insert({
          submission_id: submissionId,
          reviewer_id: user.data.user.id,
          action,
          feedback_text: feedbackText || null
        });

      if (reviewError) {
        console.error('Error creating review:', reviewError);
        throw reviewError;
      }

      // Update submission status
      const newStatus = action === 'approve' ? 'approved' : 
                       action === 'request_revision' ? 'revision_requested' : 'rejected';

      const { error: updateError } = await supabase
        .from('campaign_submissions')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('Error updating submission:', updateError);
        throw updateError;
      }

      return { submissionId, action };
    },
    onSuccess: (data) => {
      const actionText = data.action === 'approve' ? 'approved' : 
                        data.action === 'request_revision' ? 'revision requested' : 'rejected';
      toast.success(`Content ${actionText} successfully`);
      queryClient.invalidateQueries({ queryKey: ['campaign-submissions'] });
    },
    onError: (error) => {
      console.error('Failed to review submission:', error);
      toast.error('Failed to review submission');
    },
  });
};
