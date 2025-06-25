import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import useProfilePersistence from '@/hooks/useProfilePersistence';
import { SocialPlatformConnectApify } from '@/components/creator/SocialPlatformConnectApify';
import { Loader2, CheckCircle, UploadCloud, Sparkles } from 'lucide-react';
import { CreatorProfile } from '@/hooks/useCreatorProfile'; // Assuming this interface exists

// Define steps for the onboarding/profile flow
const formSteps = [
  { id: 1, title: 'Welcome', description: 'Get ready to connect with brands!' },
  { id: 2, title: 'Basic Information', description: 'Tell us about yourself.' },
  { id: 3, title: 'Profile Picture', description: 'Upload a professional photo.' },
  { id: 4, title: 'Social Connections', description: 'Connect your social media accounts.' },
  { id: 5, title: 'Content & Audience', description: 'Help brands find you.' },
  { id: 6, title: 'Complete Setup', description: 'You\'re all set!' },
];

// Dummy data for content types and industries (replace with actual data from DB if available)
const CONTENT_TYPES = [
  'Video', 'Short-form Video', 'Live Streaming', 'Photography', 'Blogging', 'Podcasting', 'Graphic Design', 'Music', 'Art', 'Gaming'
];
const INDUSTRIES = [
  'Fashion', 'Beauty', 'Fitness', 'Travel', 'Food', 'Tech', 'Gaming', 'Education', 'Finance', 'Lifestyle', 'Parenting', 'DIY', 'Sustainability'
];

interface UnifiedProfileFormProps {
  isNewUser?: boolean; // True if this is part of the initial onboarding flow
  initialData?: CreatorProfile; // Existing profile data for editing
  onProfileComplete?: () => void; // Callback when profile is successfully saved/completed
}

type FormState = {
  firstName: string;
  lastName: string;
  bio: string;
  profilePictureUrl: string | null;
  selectedPlatforms: string[];
  selectedContentTypes: string[];
  selectedIndustries: string[];
  audienceType: string;
  audienceLocation: string;
  socialAccountsConnected: boolean; // Track if at least one social is connected
};

const initialState: FormState = {
  firstName: '',
  lastName: '',
  bio: '',
  profilePictureUrl: null,
  selectedPlatforms: [],
  selectedContentTypes: [],
  selectedIndustries: [],
  audienceType: '',
  audienceLocation: 'Global',
  socialAccountsConnected: false,
};

export const UnifiedProfileForm: React.FC<UnifiedProfileFormProps> = ({
  isNewUser = false,
  initialData,
  onProfileComplete,
}) => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [currentStep, setCurrentStep] = useState(isNewUser ? 1 : 2); // Start at Welcome for new, Basic Info for edit
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState, clearPersistedForm] = useProfilePersistence<FormState>(
    'creator-profile-form',
    initialState
  );

  // Convenient destructure and helper to update fields
  const {
    firstName,
    lastName,
    bio,
    profilePictureUrl,
    selectedPlatforms,
    selectedContentTypes,
    selectedIndustries,
    audienceType,
    audienceLocation,
    socialAccountsConnected,
  } = formState;

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState({ ...formState, [key]: value });
  }, [formState, setFormState]);

  // Initialize form state with initialData if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormState({
        firstName: initialData.first_name || '',
        lastName: initialData.last_name || '',
        bio: initialData.bio || '',
        profilePictureUrl: initialData.avatar_url || null,
        selectedPlatforms: initialData.platforms || [],
        selectedContentTypes: initialData.content_types || [],
        selectedIndustries: initialData.industries || [],
        audienceType: initialData.audience_type || '',
        audienceLocation: initialData.audience_location?.primary || 'Global',
        socialAccountsConnected: initialData.social_accounts_connected || false, // Assuming this field exists
      });
    }
  }, [initialData, setFormState]);

  // Calculate completion percentage
  const profileCompletion = useCallback(() => {
    let completedFields = 0;
    if (firstName && lastName) completedFields++;
    if (bio) completedFields++;
    if (profilePictureUrl) completedFields++;
    if (socialAccountsConnected) completedFields++;
    if (selectedPlatforms.length > 0) completedFields++;
    if (selectedContentTypes.length > 0) completedFields++;
    if (selectedIndustries.length > 0) completedFields++;
    if (audienceType) completedFields++;
    // Add more fields as they become mandatory
    return Math.round((completedFields / 8) * 100); // Adjust denominator based on total mandatory fields
  }, [firstName, lastName, bio, profilePictureUrl, socialAccountsConnected, selectedPlatforms, selectedContentTypes, selectedIndustries, audienceType]);

  const handleNext = () => {
    // Validation for each step before proceeding
    if (currentStep === 2 && (!firstName.trim() || !lastName.trim() || !bio.trim())) {
      toast.error('Please fill in your first name, last name, and bio.');
      return;
    }
    if (currentStep === 3 && !profilePictureUrl) {
      toast.error('Please upload a profile picture.');
      return;
    }
    if (currentStep === 4 && !socialAccountsConnected && isNewUser) { // Only mandatory for new users
      toast.error('Please connect at least one social media account.');
      return;
    }
    if (currentStep === 5 && (selectedPlatforms.length === 0 || selectedContentTypes.length === 0 || selectedIndustries.length === 0)) {
      toast.error('Please select at least one primary platform, content type, and industry.');
      return;
    }

    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    setIsLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      updateField('profilePictureUrl', publicUrlData.publicUrl);
      toast.success('Profile picture uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast.error(`Error uploading profile picture: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialConnectionSuccess = () => {
    updateField('socialAccountsConnected', true);
    // No toast here, SocialPlatformConnectApify handles its own toast
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('creator_profiles')
        .upsert({
          user_id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          bio: bio.trim(),
          avatar_url: profilePictureUrl,
          platforms: selectedPlatforms,
          content_types: selectedContentTypes,
          industries: selectedIndustries,
          audience_type: audienceType,
          audience_location: { primary: audienceLocation },
          is_profile_complete: isNewUser ? true : initialData?.is_profile_complete, // Mark complete only if new user
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error updating creator profile:', error);
        toast.error('Failed to save profile. Please try again.');
        return;
      }

      toast.success(isNewUser ? 'Profile setup complete! Welcome to OpenSocials!' : 'Profile updated successfully!');
      clearPersistedForm(); // clear saved progress
      onProfileComplete?.(); // Call external callback
      if (isNewUser) {
        navigate('/creator/dashboard'); // Redirect to dashboard after completion for new users
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center"
          >
            <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Welcome to OpenSocials!</h2>
            <p className="text-muted-foreground">
              Let's get your creator profile set up so brands can discover you.
              Completing your profile helps us match you with the best opportunities.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg my-6">
              <h3 className="font-medium mb-2">Why complete your profile?</h3>
              <ul className="space-y-2 text-sm text-left">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Brands can discover you based on your profile information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Connect your social accounts to showcase your reach</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Get matched with relevant brand opportunities</span>
                </li>
              </ul>
            </div>
            <img
              src="/public/lovable-uploads/e4e5b130-826a-4835-aa50-1bf5466c18c9.png"
              alt="Creator illustration"
              className="mx-auto rounded-lg shadow-md max-h-48 object-contain"
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <p className="text-muted-foreground text-sm">This information will be visible to brands.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio <span className="text-red-500">*</span></Label>
              <Textarea
                id="bio"
                placeholder="Tell brands about yourself and what you do (max 500 characters)"
                value={bio}
                onChange={(e) => updateField('bio', e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/500 characters
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Tip:</span> A great bio clearly explains what you create, 
                who your audience is, and what makes your content unique.
              </p>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 text-center"
          >
            <h2 className="text-xl font-semibold">Profile Picture</h2>
            <p className="text-muted-foreground text-sm">A great profile picture helps you stand out!</p>
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              {profilePictureUrl ? (
                <div className="relative">
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    onClick={() => updateField('profilePictureUrl', null)}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="profilePicture" className="cursor-pointer">
                  <div className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
                    <UploadCloud className="h-4 w-4" />
                    <span>{profilePictureUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  </div>
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                    disabled={isLoading}
                  />
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, at least 400x400 pixels
                </p>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Tip:</span> Use a clear, professional headshot 
                that shows your face well. Brands prefer working with creators who have professional profiles.
              </p>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Connect Your Social Accounts</h2>
            <p className="text-muted-foreground text-sm">
              Connect at least one social account to showcase your audience and engagement metrics.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Note:</span> We only collect public data from your accounts.
                No passwords are stored and you can disconnect anytime.
              </p>
            </div>
            <SocialPlatformConnectApify onSuccess={handleSocialConnectionSuccess} />
            
            {socialAccountsConnected && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg mt-4">
                <CheckCircle className="h-5 w-5" />
                <span>Social account connected successfully!</span>
              </div>
            )}
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Content & Audience</h2>
            <p className="text-muted-foreground text-sm">Help brands find you based on your content and audience.</p>
            
            <div className="space-y-2">
              <Label>Primary Platforms <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter', 'Twitch'].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateField('selectedPlatforms', [...selectedPlatforms, platform]);
                        } else {
                          updateField('selectedPlatforms', selectedPlatforms.filter(p => p !== platform));
                        }
                      }}
                    />
                    <Label htmlFor={`platform-${platform}`} className="cursor-pointer">{platform}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Content Types <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-2">
                {CONTENT_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`content-${type}`}
                      checked={selectedContentTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateField('selectedContentTypes', [...selectedContentTypes, type]);
                        } else {
                          updateField('selectedContentTypes', selectedContentTypes.filter(t => t !== type));
                        }
                      }}
                    />
                    <Label htmlFor={`content-${type}`} className="cursor-pointer">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Industries <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {INDUSTRIES.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={selectedIndustries.includes(industry)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateField('selectedIndustries', [...selectedIndustries, industry]);
                        } else {
                          updateField('selectedIndustries', selectedIndustries.filter(i => i !== industry));
                        }
                      }}
                    />
                    <Label htmlFor={`industry-${industry}`} className="cursor-pointer">{industry}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audienceType">Primary Audience</Label>
              <Select value={audienceType} onValueChange={(value) => updateField('audienceType', value)}>
                <SelectTrigger id="audienceType">
                  <SelectValue placeholder="Select your primary audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gen Z">Gen Z (Under 25)</SelectItem>
                  <SelectItem value="Millennials">Millennials (25-40)</SelectItem>
                  <SelectItem value="Gen X">Gen X (41-56)</SelectItem>
                  <SelectItem value="Boomers">Baby Boomers (57+)</SelectItem>
                  <SelectItem value="Mixed">Mixed Ages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audienceLocation">Primary Audience Location</Label>
              <Select 
                value={audienceLocation} 
                onValueChange={(value) => updateField('audienceLocation', value)}
              >
                <SelectTrigger id="audienceLocation">
                  <SelectValue placeholder="Select primary location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Global">Global</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">You're All Set!</h2>
            <p className="text-muted-foreground">
              Your creator profile is ready. Brands can now discover you based on your profile information.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg my-6">
              <h3 className="font-medium mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-left">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Explore your dashboard to see available opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Complete your profile settings to customize your experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>Check your notifications for brand partnership requests</span>
                </li>
              </ul>
            </div>
            <img
              src="/public/lovable-uploads/7e63b7a0-e62c-4a35-9cb1-700719430688.png"
              alt="Success illustration"
              className="mx-auto rounded-lg shadow-md max-h-48 object-contain"
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isNewUser ? 'Creator Onboarding' : 'Edit Your Profile'}
          </CardTitle>
          <CardDescription className="text-center">
            {isNewUser 
              ? 'Complete your profile to get discovered by brands' 
              : 'Update your profile information and social connections'}
          </CardDescription>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {isNewUser ? `Step ${currentStep} of ${formSteps.length}: ${formSteps[currentStep - 1].title}` : 'Profile Completion'}
              </span>
              <span className="text-sm text-muted-foreground">
                {profileCompletion()}% complete
              </span>
            </div>
            <Progress value={profileCompletion()} className="h-2" />
            {isNewUser && (
              <div className="flex justify-between mt-2">
                {formSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      currentStep === step.id
                        ? 'text-primary'
                        : currentStep > step.id
                          ? 'text-muted-foreground'
                          : 'text-muted-foreground/50'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        currentStep === step.id
                          ? 'bg-primary'
                          : currentStep > step.id
                            ? 'bg-muted-foreground'
                            : 'bg-muted-foreground/50'
                      }`}
                    />
                    <span className="text-[10px] mt-1 hidden md:block">{step.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {isNewUser ? (
              <>
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isLoading}
                >
                  Previous
                </Button>

                {currentStep === formSteps.length ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Complete Profile Setup'
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={
                      isLoading ||
                      (currentStep === 2 && (!firstName.trim() || !lastName.trim() || !bio.trim())) ||
                      (currentStep === 3 && !profilePictureUrl) ||
                      (currentStep === 4 && !socialAccountsConnected) ||
                      (currentStep === 5 && (selectedPlatforms.length === 0 || selectedContentTypes.length === 0 || selectedIndustries.length === 0))
                    }
                  >
                    Next
                  </Button>
                )}
              </>
            ) : (
              <div className="flex justify-end w-full">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="ml-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
