
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
      // Since project_content table doesn't exist yet, return empty array
      console.log('Project content table not available yet');
      return [];
    },
    enabled: !!projectId,
  });
};

// Fetch content for a specific creator within a project
export const useProjectCreatorContent = (projectCreatorId: string) => {
  return useQuery({
    queryKey: ['project-creator-content', projectCreatorId],
    queryFn: async (): Promise<ProjectContent[]> => {
      // Since project_content table doesn't exist yet, return empty array
      console.log('Project content table not available yet');
      return [];
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
      // Since project_content table doesn't exist yet, just return mock data
      console.log('Content submission not available yet - project_content table missing');
      throw new Error('Content submission functionality not available yet');
    },
    onSuccess: (data) => {
      toast.success('Content submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-content'] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to submit content:', error);
      toast.error('Content submission not available yet');
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
      // Since project_content table doesn't exist yet, just return mock data
      console.log('Content status update not available yet - project_content table missing');
      throw new Error('Content status update functionality not available yet');
    },
    onSuccess: (data) => {
      toast.success('Content status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-content'] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to update content status:', error);
      toast.error('Content status update not available yet');
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
      // Since project_content table doesn't exist yet, just return mock data
      console.log('Content metrics update not available yet - project_content table missing');
      throw new Error('Content metrics update functionality not available yet');
    },
    onSuccess: (data) => {
      toast.success('Content metrics updated successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-content'] });
      queryClient.invalidateQueries({ queryKey: ['project-content'] });
    },
    onError: (error) => {
      console.error('Failed to update content metrics:', error);
      toast.error('Content metrics update not available yet');
    },
  });
};
