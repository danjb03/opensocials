
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

const budgetRanges = [
  'Under £1,000',
  '£1,000 - £5,000',
  '£5,000 - £10,000',
  '£10,000 - £25,000',
  '£25,000 - £50,000',
  '£50,000 - £100,000',
  'Over £100,000'
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
    brandBio,
    setBrandBio,
    budgetRange,
    setBudgetRange,
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
          .from('brand_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking profile completion:', error);
          return;
        }
        
        // If profile exists, redirect to dashboard
        if (data) {
          console.log('Brand profile already exists, redirecting from setup page');
          toast.info('Your profile is already set up');
          navigate('/brand');
        }
      } catch (error) {
        console.error('Error in profile completion check:', error);
      }
    };
    
    checkProfileCompletion();
  }, [user, navigate]);

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
              brandBio={brandBio}
              setBrandBio={setBrandBio}
              budgetRange={budgetRange}
              setBudgetRange={setBudgetRange}
              logoFile={null}
              logoPreview={logoPreview}
              logoUrl={logoUrl}
              onLogoChange={handleLogoChange}
              onClearLogo={clearLogo}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onSkip={handleSkipForNow}
              industries={industries}
              budgetRanges={budgetRanges}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupProfile;
