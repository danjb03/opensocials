
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentRequirements } from '@/types/project';

export function useBriefFiles(projectId?: string) {
  const [briefFiles, setBriefFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a supported file type. Please upload PDF, DOC, DOCX, or TXT files.`,
          variant: 'destructive',
        });
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: 'destructive',
        });
        return false;
      }
      
      return true;
    });
    
    setBriefFiles(prev => [...prev, ...validFiles]);
  };

  const uploadBriefFiles = async (currentContentRequirements: ContentRequirements | null): Promise<ContentRequirements | null> => {
    if (!projectId || briefFiles.length === 0) {
      return currentContentRequirements;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles: string[] = [];
      
      for (let i = 0; i < briefFiles.length; i++) {
        const file = briefFiles[i];
        const fileName = `${projectId}/${Date.now()}-${file.name}`;
        
        // For now, we'll just simulate upload since storage isn't set up
        // In a real implementation, you would upload to Supabase Storage here
        uploadedFiles.push(file.name);
        
        setUploadProgress(((i + 1) / briefFiles.length) * 100);
      }

      // Update the project with the brief upload information
      const updatedContentRequirements: ContentRequirements = {
        ...currentContentRequirements,
        brief_uploaded: true,
        brief_files: uploadedFiles
      };

      const { error } = await supabase
        .from('projects')
        .update({ 
          content_requirements: updatedContentRequirements as any // Type assertion needed due to JSONB type
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${briefFiles.length} file(s) uploaded successfully.`,
      });

      setBriefFiles([]);
      return updatedContentRequirements;
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
