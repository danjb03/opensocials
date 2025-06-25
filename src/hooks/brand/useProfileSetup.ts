
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useProfileSetup = () => {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [brandBio, setBrandBio] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);

  const { user } = useUnifiedAuth();
  const navigate = useNavigate();

  const handleLogoChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoFileSelect = (file: File) => {
    handleLogoChange(file);
  };

  const clearLogo = () => {
    setLogoPreview(null);
    setLogoUrl(null);
  };

  const handleSkipForNow = () => {
    navigate('/brand');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('brand_profiles')
        .upsert({
          user_id: user.id,
          company_name: companyName,
          website_url: website,
          industry,
          brand_bio: brandBio,
          budget_range: budgetRange,
          logo_url: logoUrl,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      navigate('/brand');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    companyName,
    setCompanyName,
    website,
    setWebsite,
    industry,
    setIndustry,
    brandBio,
    setBrandBio,
    budgetRange,
    setBudgetRange,
    logoPreview,
    logoUrl,
    isLoading,
    existingProfile,
    handleLogoChange,
    handleLogoFileSelect,
    clearLogo,
    handleSkipForNow,
    handleSubmit
  };
};
