
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useLogoUpload = (userId: string | undefined) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
  };

  const clearLogo = () => {
    setLogoFile(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setLogoUrl(null);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !userId) return null;
    
    try {
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `${userId}/logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, logoFile);

      if (error) {
        throw error;
      }
      
      const { data: urlData } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo.');
      return null;
    }
  };

  return {
    logoFile,
    logoPreview,
    logoUrl,
    setLogoUrl,
    handleLogoChange,
    clearLogo,
    uploadLogo
  };
};
