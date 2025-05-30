
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentRequirements } from '@/types/project';

export function useBriefFiles(projectId: string | undefined) {
  const [briefFiles, setBriefFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBriefFiles(Array.from(e.target.files));
      setUploadProgress(0);
    }
  };

  const uploadBriefFiles = async (contentRequirements: ContentRequirements | null): Promise<ContentRequirements | null> => {
    if (!projectId || briefFiles.length === 0) return contentRequirements;

    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Ensure the storage bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === 'campaign-briefs');
      if (!bucketExists) {
        const { error: bucketError } = await supabase.storage.createBucket('campaign-briefs', {
          public: true
        });
        if (bucketError) throw bucketError;
      }

      // Map each selected file to an upload promise
      const uploads = briefFiles.map(async (file, index) => {
        const ext = file.name.split('.').pop();
        const filePath = `${projectId}/${Date.now()}-${index}.${ext}`;
        const { data, error } = await supabase.storage
          .from('campaign-briefs')
          .upload(filePath, file);
        if (error) throw error;

        // update aggregated progress
        setUploadProgress(prev => prev + (100 / briefFiles.length));

        const { data: urlData } = supabase.storage
          .from('campaign-briefs')
          .getPublicUrl(data.path);
        return urlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploads);

      const updatedContentRequirements: ContentRequirements = {
        ...(contentRequirements || {}),
        brief_uploaded: true,
        brief_files: uploadedUrls
      };

      const { error: updateError } = await supabase
        .from('projects')
        .update({ content_requirements: updatedContentRequirements })
        .eq('id', projectId);

      if (updateError) throw updateError;

      toast({
        title: 'Brief Uploaded',
        description: 'Campaign brief and materials have been uploaded successfully',
      });

      return updatedContentRequirements;
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload campaign materials',
        variant: 'destructive',
      });
      return contentRequirements;
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  return {
    briefFiles,
    isUploading,
    uploadProgress,
    handleFileChange,
    uploadBriefFiles
  };
}
