
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import ProfileForm from '@/components/brand/setup/ProfileForm';
import { useProfileSetup } from '@/hooks/useProfileSetup';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

const industries = [
  'Technology', 
  'Fashion', 
  'Food & Beverage', 
  'Beauty & Cosmetics', 
  'Health & Wellness',
  'Travel & Hospitality', 
  'Entertainment', 
  'Sports', 
  'Education', 
  'Finance',
  'Other'
];

const SetupProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    companyName,
    setCompanyName,
    website,
    setWebsite,
    industry,
    setIndustry,
    logoPreview,
    logoUrl,
    isLoading,
    handleLogoChange,
    clearLogo,
    handleSkipForNow,
    handleSubmit
  } = useProfileSetup();

  // Check if profile is already complete and redirect if necessary
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_complete')
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();
          
        if (error) {
          console.error('Error checking profile completion:', error);
          return;
        }
        
        // If profile is already marked as complete, redirect to dashboard
        if (data?.is_complete === true) {
          console.log('Profile is already complete, redirecting from setup page');
          toast.info('Your profile is already set up');
          navigate('/brand');
        }
      } catch (error) {
        console.error('Error in profile completion check:', error);
      }
    };
    
    checkProfileCompletion();
  }, [user, navigate]);

  // Debug check on initial load to verify profile status
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user) return;
      
      try {
        console.log('👁️‍🗨️ SetupProfile page loaded for user:', user.id);
        
        // Check bypass flag - remove it if we're on the setup page to avoid issues
        const bypassCheck = localStorage.getItem('bypass_brand_check');
        if (bypassCheck) {
          console.log('🔄 Found bypass_brand_check flag on setup page, removing it');
          localStorage.removeItem('bypass_brand_check');
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('❌ Error checking profile status:', error);
          return;
        }
        
        console.log('📦 Current profile data on setup page:', data);
        
        // Check specific fields that might cause redirect loops
        const requiredFields = ['company_name', 'website', 'logo_url', 'industry'];
        const missing = requiredFields.filter((f) => !data?.[f]);
        console.log('❓ Missing required fields:', missing);
        console.log('✅ is_complete flag:', data?.is_complete);
      } catch (error) {
        console.error('❌ Error in profile status check:', error);
      }
    };
    
    checkProfileStatus();
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Set Up Your Brand Profile</h1>
          <p className="text-muted-foreground">Complete your profile to get started</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
            <CardDescription>
              Tell us about your brand to help creators understand who you are
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              companyName={companyName}
              setCompanyName={setCompanyName}
              website={website}
              setWebsite={setWebsite}
              industry={industry}
              setIndustry={setIndustry}
              logoFile={null}
              logoPreview={logoPreview}
              logoUrl={logoUrl}
              onLogoChange={handleLogoChange}
              onClearLogo={clearLogo}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onSkip={handleSkipForNow}
              industries={industries}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupProfile;
