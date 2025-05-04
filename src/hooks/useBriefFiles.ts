
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentRequirements } from '@/types/project';

export function useBriefFiles(projectId: string | undefined) {
  const [briefFiles, setBriefFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBriefFiles(Array.from(e.target.files));
    }
  };

  const uploadBriefFiles = async (contentRequirements: ContentRequirements | null): Promise<ContentRequirements | null> => {
    if (!projectId || briefFiles.length === 0) return contentRequirements;

    setIsUploading(true);
    try {
      // This would be an actual file upload to Supabase storage
      // For now we'll just simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare updated content requirements with brief info
      const updatedContentRequirements: ContentRequirements = {
        ...(contentRequirements || {}),
        brief_uploaded: true,
        brief_files: briefFiles.map(file => file.name)
      };
      
      // Update project record with brief_uploaded flag
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
    }
  };

  return {
    briefFiles,
    isUploading,
    handleFileChange,
    uploadBriefFiles
  };
}
