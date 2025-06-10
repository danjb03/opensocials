
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '@/components/brand/setup/ProfileForm';
import { useProfileSetup } from '@/hooks/useProfileSetup';
import BrandLayout from '@/components/layouts/BrandLayout';

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
    existingProfile,
    handleLogoChange,
    clearLogo,
    handleSkipForNow,
    handleSubmit
  } = useProfileSetup();

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              {existingProfile ? 'Edit Your Brand Profile' : 'Set Up Your Brand Profile'}
            </h1>
            <p className="text-muted-foreground">
              {existingProfile ? 'Update your profile information' : 'Complete your profile to get started'}
            </p>
          </div>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Brand Information</CardTitle>
              <CardDescription className="text-muted-foreground">
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
    </BrandLayout>
  );
};

export default SetupProfile;
