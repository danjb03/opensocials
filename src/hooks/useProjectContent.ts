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
      const { data, error } = await supabase
        .from('project_content')
        .select(`
          id,
          project_creator_id,
          content_type,
          platform,
          title,
          description,
          file_url,
          file_size,
          file_type,
          thumbnail_url,
          status,
          reviewer_id,
          review_notes,
          review_date,
          published_url,
          published_date,
          views,
          likes,
          comments,
          shares,
          engagement_rate,
          created_at,
          updated_at,
          project_creators!project_content_project_creator_id_fkey (
            project_id,
            profiles!project_creators_creator_id_fkey (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('project_creators.project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project content:', error);
        throw error;
      }

      return data?.map((content: any) => ({
        id: content.id,
        projectCreatorId: content.project_creator_id,
        contentType: content.content_type,
        platform: content.platform,
        title: content.title,
        description: content.description,
        fileUrl: content.file_url,
        fileSize: content.file_size,
        fileType: content.file_type,
        thumbnailUrl: content.thumbnail_url,
        status: content.status,
        reviewerId: content.reviewer_id,
        reviewNotes: content.review_notes,
        reviewDate: content.review_date,
        publishedUrl: content.published_url,
        publishedDate: content.published_date,
        views: content.views || 0,
        likes: content.likes || 0,
        comments: content.comments || 0,
        shares: content.shares || 0,
        engagementRate: content.engagement_rate,
        createdAt: content.created_at,
        updatedAt: content.updated_at,
        creatorInfo: {
          id: content.project_creators?.profiles?.id,
          name: content.project_creators?.profiles?.full_name,
          avatarUrl: content.project_creators?.profiles?.avatar_url,
        },
      })) || [];
    },
    enabled: !!projectId,
  });
};

// Fetch content for a specific creator within a project
export const useProjectCreatorContent = (projectCreatorId: string) => {
  return useQuery({
    queryKey: ['project-creator-content', projectCreatorId],
    queryFn: async (): Promise<ProjectContent[]> => {
      const { data, error } = await supabase
        .from('project_content')
        .select(`
          id,
          project_creator_id,
          content_type,
          platform,
          title,
          description,
          file_url,
          file_size,
          file_type,
          thumbnail_url,
          status,
          reviewer_id,
          review_notes,
          review_date,
          published_url,
          published_date,
          views,
          likes,
          comments,
          shares,
          engagement_rate,
          created_at,
          updated_at
        `)
        .eq('project_creator_id', projectCreatorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creator content:', error);
        throw error;
      }

      return data || [];
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
        .from('project_content')
        .insert({
          project_creator_id: projectCreatorId,
          content_type: contentType,
          platform,
          title,
          description,
          file_url: fileUrl,
          file_size: fileSize,
          file_type: fileType,
          thumbnail_url: thumbnailUrl,
          status: 'submitted',
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
      queryClient.invalidateQueries({ queryKey: ['project-creator-content', data.project_creator_id] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to submit content:', error);
      toast.error('Failed to submit content. Please try again.');
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
      const updateData: any = {
        status,
        review_date: new Date().toISOString(),
      };

      if (reviewNotes) updateData.review_notes = reviewNotes;
      if (reviewerId) updateData.reviewer_id = reviewerId;

      const { data, error } = await supabase
        .from('project_content')
        .update(updateData)
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
      queryClient.invalidateQueries({ queryKey: ['project-creator-content', data.project_creator_id] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to update content status:', error);
      toast.error('Failed to update content status. Please try again.');
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
      const updateData: any = {};

      if (views !== undefined) updateData.views = views;
      if (likes !== undefined) updateData.likes = likes;
      if (comments !== undefined) updateData.comments = comments;
      if (shares !== undefined) updateData.shares = shares;
      if (engagementRate !== undefined) updateData.engagement_rate = engagementRate;
      if (publishedUrl) updateData.published_url = publishedUrl;
      if (publishedDate) updateData.published_date = publishedDate;

      const { data, error } = await supabase
        .from('project_content')
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
      queryClient.invalidateQueries({ queryKey: ['project-creator-content', data.project_creator_id] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to update content metrics:', error);
      toast.error('Failed to update content metrics. Please try again.');
    },
  });
};