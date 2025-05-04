import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';
import { useLogoUpload } from './brand/useLogoUpload';
import { useBrandNavigation } from './brand/useBrandNavigation';

export const useProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState<string>('');
  
  // Hooks
  const { logoFile, logoPreview, logoUrl, setLogoUrl, handleLogoChange, clearLogo, uploadLogo } = 
    useLogoUpload(user?.id);
  const { redirectToDashboard } = useBrandNavigation();

  // Load existing profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();
          
        if (error) {
          console.error('❌ Error fetching brand profile:', error);
          return;
        }
        
        if (data) {
          console.log('📦 Found existing brand profile:', data);
          setExistingProfile(data);
          setCompanyName(data.company_name || '');
          setWebsite(data.website || '');
          setIndustry(data.industry || '');
          setLogoUrl(data.logo_url || null);
        }
      } catch (error) {
        console.error('❌ Error checking brand profile:', error);
      }
    };
    
    checkExistingProfile();
  }, [user, setLogoUrl]);

  const handleSkipForNow = async () => {
    if (!user) {
      toast.error('You must be logged in to continue');
      navigate('/auth');
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        company_name: companyName || 'My Brand',
        is_complete: true,
        role: 'brand',
        status: 'accepted'
      };

      console.log("💾 Updating minimal profile data:", profileData);

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Welcome to your brand dashboard!');
      localStorage.setItem('bypass_brand_check', 'true');

      setTimeout(() => {
        window.location.href = '/brand';
      }, 500);
    } catch (error: any) {
      console.error('❌ Error skipping profile setup:', error);
      toast.error('Failed to continue: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to complete profile setup');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    console.log("🚀 Starting profile setup submission");

    try {
      let uploadedLogoUrl = null;
      if (logoFile) {
        uploadedLogoUrl = await uploadLogo();
        console.log("🖼️ Logo uploaded:", uploadedLogoUrl);
      }

      const profileData = {
        company_name: companyName,
        website: website || null,
        industry: industry || null,
        logo_url: uploadedLogoUrl || logoUrl,
        is_complete: true,
        role: 'brand',
        status: 'accepted'
      };

      console.log("💾 Updating profile with data:", profileData);

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile setup complete!');
      localStorage.setItem('bypass_brand_check', 'true');

      setTimeout(() => {
        window.location.href = '/brand';
      }, 500);
    } catch (error: any) {
      console.error('❌ Error setting up profile:', error);
      toast.error('Failed to set up profile: ' + (error.message || 'Unknown error'));
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
    logoFile,
    logoPreview,
    logoUrl,
    isLoading,
    handleLogoChange,
    clearLogo,
    handleSkipForNow,
    handleSubmit
  };
};

