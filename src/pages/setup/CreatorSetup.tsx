import React, { useState, useEffect } from 'react';
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
import { SocialPlatformConnectApify } from '@/components/creator/SocialPlatformConnectApify';
import { Loader2, CheckCircle, UploadCloud, Sparkles } from 'lucide-react';

// Define steps for the onboarding flow
const onboardingSteps = [
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

const CreatorSetup = () => {
  const navigate = useNavigate();
  const { user, creatorProfile } = useUnifiedAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [audienceType, setAudienceType] = useState('');
  const [audienceLocation, setAudienceLocation] = useState('Global');
  const [socialAccountsConnected, setSocialAccountsConnected] = useState(false); // Track if at least one social is connected

  useEffect(() => {
    if (creatorProfile?.is_profile_complete) {
      navigate('/creator/dashboard'); // Redirect if profile is already complete
    }
    // Initialize form fields if profile data exists (e.g., user started but didn't finish)
    if (creatorProfile) {
      setFirstName(creatorProfile.first_name || '');
      setLastName(creatorProfile.last_name || '');
      setBio(creatorProfile.bio || '');
      setProfilePictureUrl(creatorProfile.avatar_url || null);
      setSelectedPlatforms(creatorProfile.platforms || []);
      setSelectedContentTypes(creatorProfile.content_types || []);
      setSelectedIndustries(creatorProfile.industries || []);
      setAudienceType(creatorProfile.audience_type || '');
      setAudienceLocation(creatorProfile.audience_location?.primary || 'Global');
    }
  }, [creatorProfile, navigate]);

  useEffect(() => {
    // Calculate completion percentage
    let completedFields = 0;
    if (firstName && lastName) completedFields++;
    if (bio) completedFields++;
    if (profilePictureUrl) completedFields++;
    if (socialAccountsConnected) completedFields++;
    if (selectedPlatforms.length > 0) completedFields++;
    if (selectedContentTypes.length > 0) completedFields++;
    if (selectedIndustries.length > 0) completedFields++;
    if (audienceType) completedFields++;
    
    setProfileCompletion(Math.round((completedFields / 8) * 100));
  }, [firstName, lastName, bio, profilePictureUrl, socialAccountsConnected, selectedPlatforms, selectedContentTypes, selectedIndustries, audienceType]);

  const handleNext = () => {
    // Validation for each step before proceeding
    if (currentStep === 2 && (!firstName.trim() || !lastName.trim())) {
      toast.error('Please fill in your first and last name.');
      return;
    }
    if (currentStep === 3 && !profilePictureUrl) {
      toast.error('Please upload a profile picture.');
      return;
    }
    if (currentStep === 4 && !socialAccountsConnected) {
      toast.error('Please connect at least one social media account.');
      return;
    }
    if (currentStep === 5 && (selectedPlatforms.length === 0 || selectedContentTypes.length === 0 || selectedIndustries.length === 0)) {
      toast.error('Please select at least one platform, content type, and industry.');
      return;
    }

    if (currentStep < onboardingSteps.length) {
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
    setProfilePictureFile(file);
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

      setProfilePictureUrl(publicUrlData.publicUrl);
      toast.success('Profile picture uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast.error(`Error uploading profile picture: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialConnectionSuccess = () => {
    setSocialAccountsConnected(true);
    toast.success('Social account connected successfully!');
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
          is_profile_complete: true, // Mark profile as complete
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error updating creator profile:', error);
        toast.error('Failed to save profile. Please try again.');
        return;
      }

      toast.success('Profile setup complete! Welcome to OpenSocials!');
      navigate('/creator/dashboard'); // Redirect to dashboard after completion
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
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="lastName" 
                  placeholder="Your last name" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio <span className="text-red-500">*</span></Label>
              <Textarea 
                id="bio" 
                placeholder="Tell brands about yourself and what you do (max 500 characters)" 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
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
                    onClick={() => setProfilePictureUrl(null)}
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
                          setSelectedPlatforms([...selectedPlatforms, platform]);
                        } else {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
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
                          setSelectedContentTypes([...selectedContentTypes, type]);
                        } else {
                          setSelectedContentTypes(selectedContentTypes.filter(t => t !== type));
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
                          setSelectedIndustries([...selectedIndustries, industry]);
                        } else {
                          setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
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
              <Select value={audienceType} onValueChange={setAudienceType}>
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
              <Select value={audienceLocation} onValueChange={setAudienceLocation}>
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Creator Onboarding</CardTitle>
          <CardDescription className="text-center">
            Complete your profile to get discovered by brands
          </CardDescription>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {onboardingSteps.length}: {onboardingSteps[currentStep - 1].title}
              </span>
              <span className="text-sm text-muted-foreground">
                {profileCompletion}% complete
              </span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <div className="flex justify-between mt-2">
              {onboardingSteps.map((step) => (
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
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
            >
              Previous
            </Button>
            
            {currentStep === onboardingSteps.length ? (
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
                  'Complete Setup'
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  isLoading ||
                  (currentStep === 2 && (!firstName.trim() || !lastName.trim())) ||
                  (currentStep === 3 && !profilePictureUrl) ||
                  (currentStep === 4 && !socialAccountsConnected) ||
                  (currentStep === 5 && (selectedPlatforms.length === 0 || selectedContentTypes.length === 0 || selectedIndustries.length === 0))
                }
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorSetup;
