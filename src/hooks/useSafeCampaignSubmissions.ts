import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/safe-client';
import { toast } from 'sonner';
import type { CampaignSubmission } from '@/types/campaignReview';
import { createSafeQueryHook, createSafeMutationHook, useSafeRender } from './safe-hooks';

// Augment submission type locally with revision_count helper
type SubmissionWithMeta = CampaignSubmission & { revision_count: number };

/**
 * Original hook for fetching campaign submissions
 * Not to be used directly - use useSafeCampaignSubmissions instead
 */
const useRawCampaignSubmissions = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-submissions', campaignId],
    queryFn: async (): Promise<SubmissionWithMeta[]> => {
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
          // Count number of revision requests for this submission
          const { count: revisionCount } = await supabase
            .from('submission_reviews')
            .select('id', { head: true, count: 'exact' })
            .eq('submission_id', submission.id)
            .eq('action', 'request_revision');

          const { data: creator } = await supabase
            .from('creator_profiles')
            .select('id, user_id, first_name, last_name, avatar_url')
            .eq('user_id', submission.creator_id)
            .single();

          return {
            ...submission,
            revision_count: revisionCount ?? 0,
            creator_info: creator ? {
              id: creator.id,
              name: `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Creator',
              avatar_url: creator.avatar_url
            } : undefined
          } as SubmissionWithMeta;
        })
      );

      return submissionsWithCreators;
    },
    enabled: !!campaignId,
  });
};

/**
 * Original hook for submitting content
 * Not to be used directly - use useSafeSubmitContent instead
 */
const useRawSubmitContent = () => {
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

/**
 * Original hook for reviewing submissions
 * Not to be used directly - use useSafeReviewSubmission instead
 */
const useRawReviewSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      action,
      feedbackText
    }: {
      submissionId: string;
      action: 'approve' | 'request_revision';
      feedbackText?: string;
    }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Prevent more than 2 revision requests
      if (action === 'request_revision') {
        const { count: existingRevisions, error: countError } = await supabase
          .from('submission_reviews')
          .select('id', { head: true, count: 'exact' })
          .eq('submission_id', submissionId)
          .eq('action', 'request_revision');

        if (countError) {
          console.error('Error counting revisions:', countError);
          throw countError;
        }

        if ((existingRevisions ?? 0) >= 2) {
          throw new Error('This submission has reached the maximum number of revision requests.');
        }
      }

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
      toast.error(
        error instanceof Error ? error.message : 'Failed to review submission'
      );
    },
  });
};

/**
 * Safe hook for fetching campaign submissions
 * Includes build-time protection and error handling
 */
export const useSafeCampaignSubmissions = createSafeQueryHook(
  useRawCampaignSubmissions,
  [] as SubmissionWithMeta[]
);

/**
 * Safe hook for submitting content
 * Includes build-time protection and error handling
 */
export const useSafeSubmitContent = createSafeMutationHook(useRawSubmitContent);

/**
 * Safe hook for reviewing submissions
 * Includes build-time protection and error handling
 */
export const useSafeReviewSubmission = createSafeMutationHook(useRawReviewSubmission);

/**
 * Component-ready hook that provides campaign submissions with loading states
 * and error handling
 */
export const useCampaignSubmissions = (campaignId: string) => {
  const { shouldRender } = useSafeRender();
  const result = useSafeCampaignSubmissions(campaignId);
  
  // Return empty data with loading state if not ready to render
  if (!shouldRender) {
    return {
      data: [] as SubmissionWithMeta[],
      isLoading: true,
      isError: false,
      error: null,
      retry: () => {},
    };
  }
  
  return result;
};

/**
 * Component-ready hook for content submission with loading states
 * and error handling
 */
export const useSubmitContent = () => {
  const { shouldRender } = useSafeRender();
  const result = useSafeSubmitContent();
  
  // Return mock mutation if not ready to render
  if (!shouldRender) {
    return {
      mutateAsync: async () => {
        throw new Error('Service not available');
      },
      isPending: false,
      isError: false,
      error: null,
      isReady: false,
    };
  }
  
  return result;
};

/**
 * Component-ready hook for reviewing submissions with loading states
 * and error handling
 */
export const useReviewSubmission = () => {
  const { shouldRender } = useSafeRender();
  const result = useSafeReviewSubmission();
  
  // Return mock mutation if not ready to render
  if (!shouldRender) {
    return {
      mutateAsync: async () => {
        throw new Error('Service not available');
      },
      isPending: false,
      isError: false,
      error: null,
      isReady: false,
    };
  }
  
  return result;
};
