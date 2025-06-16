
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
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
  const [brandBio, setBrandBio] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  
  // Hooks
  const { logoFile, logoPreview, logoUrl, setLogoUrl, handleLogoChange, clearLogo, uploadLogo } = 
    useLogoUpload(user?.id);
  const { redirectToDashboard } = useBrandNavigation();

  // Handle direct file selection from drag and drop
  const handleLogoFileSelect = (file: File) => {
    const preview = URL.createObjectURL(file);
    const syntheticEvent = {
      target: {
        files: [file]
      }
    } as any;
    handleLogoChange(syntheticEvent);
  };

  // Load existing profile when component mounts
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('❌ Error fetching brand profile:', error);
          return;
        }
        
        if (data) {
          console.log('📦 Found existing brand profile, populating form');
          setExistingProfile(data);
          setCompanyName(data.company_name || '');
          setWebsite(data.website_url || '');
          setIndustry(data.industry || '');
          setBrandBio(data.brand_bio || '');
          setBudgetRange(data.budget_range || '');
          setLogoUrl(data.logo_url || null);
        }
      } catch (error) {
        console.error('❌ Error checking brand profile:', error);
      }
    };
    
    loadExistingProfile();
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
        user_id: user.id,
        company_name: companyName || 'My Brand',
        website_url: null,
        industry: null,
        brand_bio: null,
        budget_range: null,
        logo_url: null,
        brand_goal: null,
        campaign_focus: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("💾 Creating minimal brand profile:", profileData);

      // Use upsert to handle existing profiles
      const { error } = await supabase
        .from('brand_profiles')
        .upsert(profileData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('✅ Brand profile saved successfully');
      toast.success('Welcome to your brand dashboard!');
      
      // Clear any bypass flags and redirect
      localStorage.removeItem('bypass_brand_check');
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
    console.log("🚀 Starting brand profile setup submission");

    try {
      let uploadedLogoUrl = null;
      if (logoFile) {
        console.log("🖼️ Uploading logo...");
        uploadedLogoUrl = await uploadLogo();
        console.log("🖼️ Logo uploaded:", uploadedLogoUrl);
      }

      const profileData = {
        user_id: user.id,
        company_name: companyName.trim(),
        website_url: website.trim() || null,
        industry: industry || null,
        brand_bio: brandBio.trim() || null,
        budget_range: budgetRange || null,
        logo_url: uploadedLogoUrl || logoUrl || null,
        brand_goal: null,
        campaign_focus: null,
        created_at: existingProfile ? existingProfile.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("💾 Saving brand profile with data:", profileData);

      // Use upsert to handle both create and update scenarios
      const { data: savedProfile, error } = await supabase
        .from('brand_profiles')
        .upsert(profileData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('✅ Brand profile saved successfully:', savedProfile);
      toast.success('Profile setup complete!');
      
      // Clear any bypass flags
      localStorage.removeItem('bypass_brand_check');
      
      // Force a page refresh to ensure the profile is loaded in auth context
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
    brandBio,
    setBrandBio,
    budgetRange,
    setBudgetRange,
    logoFile,
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
