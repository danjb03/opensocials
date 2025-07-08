
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BasicInfoSection } from '@/components/creator/form-sections/BasicInfoSection';
import { IndustryContentSection } from '@/components/creator/form-sections/IndustryContentSection';
import { CreatorTypeDropdown } from '@/components/creator/setup/CreatorTypeDropdown';
import { SocialPlatformConnect } from '@/components/creator/SocialPlatformConnect';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useCreatorAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [primaryPlatforms, setPrimaryPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [audienceType, setAudienceType] = useState('');
  const [audienceLocation, setAudienceLocation] = useState('Global');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [creatorType, setCreatorType] = useState('');

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validate required fields
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please fill in your first and last name');
      return;
    }

    if (selectedIndustries.length === 0) {
      toast.error('Please select at least one industry');
      return;
    }

    if (primaryPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (contentTypes.length === 0) {
      toast.error('Please select at least one content format');
      return;
    }

    if (!creatorType) {
      toast.error('Please select your creator type');
      return;
    }

    setIsLoading(true);

    try {
      // Update creator profile with all required fields
      const { error } = await supabase
        .from('creator_profiles')
        .upsert({
          user_id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          bio: bio.trim(),
          primary_platform: primaryPlatforms.join(', '),
          content_type: contentTypes.join(', '),
          content_types: contentTypes,
          platforms: primaryPlatforms,
          industries: selectedIndustries,
          creator_type: creatorType,
          audience_type: audienceType,
          audience_location: {
            primary: audienceLocation
          },
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating creator profile:', error);
        toast.error('Failed to save profile. Please try again.');
        return;
      }

      toast.success('Profile completed successfully!');
      navigate('/creator');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoSection 
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            bio={bio}
            setBio={setBio}
          />
        );
      case 2:
        return (
          <Card>
            <CardContent className="pt-6">
              <CreatorTypeDropdown selected={creatorType} setSelected={setCreatorType} />
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <IndustryContentSection 
            selectedIndustries={selectedIndustries}
            setSelectedIndustries={setSelectedIndustries}
            primaryPlatforms={primaryPlatforms}
            setPrimaryPlatforms={setPrimaryPlatforms}
            contentTypes={contentTypes}
            setContentTypes={setContentTypes}
            audienceType={audienceType}
            setAudienceType={setAudienceType}
            audienceLocation={audienceLocation}
            setAudienceLocation={setAudienceLocation}
          />
        );
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Social Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialPlatformConnect onSuccess={() => {}} />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Basic Information';
      case 2:
        return 'Creator Type';
      case 3:
        return 'Content & Industries';
      case 4:
        return 'Social Connections';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Creator Profile</h1>
        <p className="text-muted-foreground mb-6">
          Set up your profile to start getting discovered by brands
        </p>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}: {getStepTitle()}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="space-y-6">
        {renderStep()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Complete Profile Setup'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!firstName.trim() || !lastName.trim())) ||
                (currentStep === 2 && !creatorType) ||
                (currentStep === 3 && (selectedIndustries.length === 0 || primaryPlatforms.length === 0 || contentTypes.length === 0))
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
