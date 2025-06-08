
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProjectContent {
  id: string;
  projectCreatorId: string;
  contentType: 'video' | 'post' | 'story' | 'reel' | 'short';
  platform: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  thumbnailUrl?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published' | 'archived';
  reviewerId?: string;
  reviewNotes?: string;
  reviewDate?: string;
  publishedUrl?: string;
  publishedDate?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate?: number;
  createdAt: string;
  updatedAt: string;
  creatorInfo?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

// Fetch content for a project
export const useProjectContent = (projectId: string) => {
  return useQuery({
    queryKey: ['project-content', projectId],
    queryFn: async (): Promise<ProjectContent[]> => {
      const { data: content, error } = await supabase
        .from('campaign_content')
        .select(`
          *,
          creator_profiles!campaign_content_creator_id_fkey (
            user_id,
            first_name,
            last_name
          )
        `)
        .eq('campaign_id', projectId);

      if (error) {
        console.error('Error fetching project content:', error);
        throw error;
      }

      return (content || []).map(item => ({
        id: item.id,
        projectCreatorId: item.creator_id,
        contentType: item.content_type as any,
        platform: item.platform,
        title: item.title,
        description: item.description,
        status: mapContentStatus(item.status),
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        creatorInfo: {
          id: item.creator_profiles?.user_id || '',
          name: `${item.creator_profiles?.first_name || ''} ${item.creator_profiles?.last_name || ''}`.trim() || 'Unknown Creator'
        }
      }));
    },
    enabled: !!projectId,
  });
};

// Map database status to ProjectContent status
function mapContentStatus(dbStatus: string): ProjectContent['status'] {
  switch (dbStatus) {
    case 'pending': return 'submitted';
    case 'approved': return 'approved';
    case 'rejected': return 'rejected';
    case 'revision_requested': return 'under_review';
    default: return 'draft';
  }
}

// Fetch content for a specific creator within a project
export const useProjectCreatorContent = (projectCreatorId: string) => {
  return useQuery({
    queryKey: ['project-creator-content', projectCreatorId],
    queryFn: async (): Promise<ProjectContent[]> => {
      const { data: content, error } = await supabase
        .from('campaign_content')
        .select(`
          *,
          creator_profiles!campaign_content_creator_id_fkey (
            user_id,
            first_name,
            last_name
          )
        `)
        .eq('creator_id', projectCreatorId);

      if (error) {
        console.error('Error fetching creator content:', error);
        throw error;
      }

      return (content || []).map(item => ({
        id: item.id,
        projectCreatorId: item.creator_id,
        contentType: item.content_type as any,
        platform: item.platform,
        title: item.title,
        description: item.description,
        status: mapContentStatus(item.status),
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        creatorInfo: {
          id: item.creator_profiles?.user_id || '',
          name: `${item.creator_profiles?.first_name || ''} ${item.creator_profiles?.last_name || ''}`.trim() || 'Unknown Creator'
        }
      }));
    },
    enabled: !!projectCreatorId,
  });
};

// Submit new content
export const useSubmitContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectCreatorId,
      campaignId,
      contentType,
      platform,
      title,
      description,
      fileUrl,
      fileSize,
      fileType,
      thumbnailUrl,
    }: {
      projectCreatorId: string;
      campaignId: string;
      contentType: 'video' | 'post' | 'story' | 'reel' | 'short';
      platform: string;
      title?: string;
      description?: string;
      fileUrl?: string;
      fileSize?: number;
      fileType?: string;
      thumbnailUrl?: string;
    }) => {
      const { data, error } = await supabase
        .from('campaign_content')
        .insert({
          campaign_id: campaignId,
          creator_id: projectCreatorId,
          title: title || 'Untitled Content',
          description: description,
          content_type: contentType,
          platform: platform,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting content:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Content submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-content'] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to submit content:', error);
      toast.error('Failed to submit content');
    },
  });
};

// Update content status (for reviews)
export const useUpdateContentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      status,
      reviewNotes,
      reviewerId,
    }: {
      contentId: string;
      status: 'under_review' | 'approved' | 'rejected' | 'published' | 'archived';
      reviewNotes?: string;
      reviewerId?: string;
    }) => {
      // Map status back to database values
      const dbStatus = status === 'approved' ? 'approved' : 
                      status === 'rejected' ? 'rejected' : 
                      status === 'under_review' ? 'revision_requested' : 'pending';

      const { data, error } = await supabase
        .from('campaign_content')
        .update({
          status: dbStatus,
          feedback: reviewNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating content status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Content status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-content'] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to update content status:', error);
      toast.error('Failed to update content status');
    },
  });
};

// Update content performance metrics
export const useUpdateContentMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      views,
      likes,
      comments,
      shares,
      engagementRate,
      publishedUrl,
      publishedDate,
    }: {
      contentId: string;
      views?: number;
      likes?: number;
      comments?: number;
      shares?: number;
      engagementRate?: number;
      publishedUrl?: string;
      publishedDate?: string;
    }) => {
      // For now, just update the status if it's published
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (publishedUrl) {
        updateData.status = 'approved'; // Mark as approved if published
      }

      const { data, error } = await supabase
        .from('campaign_content')
        .update(updateData)
        .eq('id', contentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating content metrics:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Content metrics updated successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-content'] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to update content metrics:', error);
      toast.error('Failed to update content metrics');
    },
  });
};
