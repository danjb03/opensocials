
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BriefFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface UploadedFile {
  file: File;
  url: string;
  id: string;
}

export const useBriefFiles = () => {
  const [files, setFiles] = useState<BriefFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadFiles = async (fileList: FileList, projectId: string) => {
    setIsUploading(true);
    const newUploadedFiles: UploadedFile[] = [];

    try {
      for (const file of Array.from(fileList)) {
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `briefs/${projectId}/${fileName}`;

        // Upload to Supabase Storage (if configured)
        // For now, create a temporary URL
        const url = URL.createObjectURL(file);
        
        const uploadedFile: UploadedFile = {
          file,
          url,
          id: Math.random().toString(36)
        };

        newUploadedFiles.push(uploadedFile);

        // Store file metadata
        const briefFile: BriefFile = {
          id: uploadedFile.id,
          name: file.name,
          url: url,
          type: file.type,
          size: file.size
        };

        setFiles(prev => [...prev, briefFile]);
      }

      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      toast.success(`Uploaded ${fileList.length} file(s) successfully`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('File removed');
  };

  const clearAllFiles = () => {
    // Clean up object URLs
    uploadedFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    
    setFiles([]);
    setUploadedFiles([]);
  };

  // Save content requirements with proper JSON casting
  const saveContentRequirements = useMutation({
    mutationFn: async ({ projectId, requirements }: { 
      projectId: string; 
      requirements: any; 
    }) => {
      const { error } = await supabase
        .from('projects')
        .update({
          content_requirements: requirements as any // Cast to any to avoid JSON type issues
        })
        .eq('id', projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Content requirements saved');
    },
    onError: (error) => {
      console.error('Error saving content requirements:', error);
      toast.error('Failed to save content requirements');
    }
  });

  return {
    files,
    uploadedFiles,
    isUploading,
    uploadFiles,
    removeFile,
    clearAllFiles,
    saveContentRequirements: saveContentRequirements.mutate,
    isSaving: saveContentRequirements.isPending
  };
};
