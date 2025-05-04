
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import ProfileForm from '@/components/brand/setup/ProfileForm';
import { useProfileSetup } from '@/hooks/useProfileSetup';

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
