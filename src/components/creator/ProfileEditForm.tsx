
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreatorProfile } from '@/hooks/useCreatorProfile';
import { Card, CardContent } from '@/components/ui/card';
import { industries } from '@/data/industries';
import { CreatorTypeSelector } from '@/components/creator/setup/CreatorTypeSelector';
import OAuthConnectButtons from '@/components/creator/OAuthConnectButtons';

export interface ProfileEditFormProps {
  profile: CreatorProfile;
  isLoading: boolean;
  onSubmit: (updatedProfile: Partial<CreatorProfile>) => Promise<void>;
  onCancel: () => void;
}

const contentTypeOptions = [
  'Short Form Video',
  'Long Form Video', 
  'Photos',
  'Live Streaming',
  'Audio',
  'Text',
  'Podcasts',
  'Blog Posts',
  'Stories',
  'Reels',
  'IGTV',
  'YouTube Shorts',
  'TikTok Videos',
  'X Threads',
  'LinkedIn Articles',
  'Newsletter',
  'Webinars',
  'Tutorials',
  'Reviews',
  'Unboxing'
];

const platformOptions = [
  'TikTok',
  'Instagram', 
  'YouTube',
  'X',
  'Twitch',
  'LinkedIn',
  'Facebook',
  'Snapchat',
  'Pinterest'
];

const ProfileEditForm = ({ profile, isLoading, onSubmit, onCancel }: ProfileEditFormProps) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [bio, setBio] = useState(profile.bio);
  const [primaryPlatforms, setPrimaryPlatforms] = useState<string[]>(
    profile.primaryPlatform ? profile.primaryPlatform.split(', ') : []
  );
  const [contentTypes, setContentTypes] = useState<string[]>(
    profile.contentType ? profile.contentType.split(', ') : []
  );
  const [audienceType, setAudienceType] = useState(profile.audienceType);
  const [audienceLocation, setAudienceLocation] = useState(profile.audienceLocation.primary);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(profile.industries || []);
  const [customIndustry, setCustomIndustry] = useState('');
  const [creatorType, setCreatorType] = useState(profile.creatorType || '');
  const [customPlatform, setCustomPlatform] = useState('');
  const [showOtherPlatform, setShowOtherPlatform] = useState(false);

  const handlePlatformToggle = (platform: string) => {
    if (platform === 'Other') {
      setShowOtherPlatform(!showOtherPlatform);
      if (showOtherPlatform) {
        // Remove any custom platforms when hiding Other
        setPrimaryPlatforms(prev => prev.filter(p => platformOptions.includes(p)));
        setCustomPlatform('');
      }
      return;
    }

    setPrimaryPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleCustomPlatformAdd = () => {
    if (customPlatform.trim() && !primaryPlatforms.includes(customPlatform.trim())) {
      setPrimaryPlatforms(prev => [...prev, customPlatform.trim()]);
      setCustomPlatform('');
    }
  };

  const handleContentTypeToggle = (contentType: string) => {
    setContentTypes(prev => 
      prev.includes(contentType) 
        ? prev.filter(c => c !== contentType)
        : [...prev, contentType]
    );
  };

  const handleIndustrySelect = (industry: string) => {
    if (industry && !selectedIndustries.includes(industry)) {
      setSelectedIndustries(prev => [...prev, industry]);
    }
  };

  const handleCustomIndustryAdd = () => {
    if (customIndustry.trim() && !selectedIndustries.includes(customIndustry.trim())) {
      setSelectedIndustries(prev => [...prev, customIndustry.trim()]);
      setCustomIndustry('');
    }
  };

  const removeIndustry = (industry: string) => {
    setSelectedIndustries(prev => prev.filter(i => i !== industry));
  };

  const removePlatform = (platform: string) => {
    setPrimaryPlatforms(prev => prev.filter(p => p !== platform));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please fill in your first and last name');
      return;
    }

    if (selectedIndustries.length === 0) {
      alert('Please select at least one industry');
      return;
    }

    if (primaryPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (contentTypes.length === 0) {
      alert('Please select at least one content format');
      return;
    }

    if (!creatorType) {
      alert('Please select your creator type');
      return;
    }

    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        primaryPlatform: primaryPlatforms.join(', '),
        contentType: contentTypes.join(', '),
        audienceType,
        audienceLocation: {
          ...profile.audienceLocation,
          primary: audienceLocation
        },
        industries: selectedIndustries,
        creatorType,
        isProfileComplete: true
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
                required
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands a bit about yourself..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Creator Type *</h3>
          <CreatorTypeSelector selected={creatorType} setSelected={setCreatorType} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Connect Your Social Media</h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect your social media accounts to showcase your reach and get ready for brand collaborations.
          </p>
          <OAuthConnectButtons 
            platforms={profile.socialConnections}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Industry & Content</h3>
          <div className="space-y-6">
            
            {/* Industry Selection */}
            <div className="space-y-3">
              <Label>Industries *</Label>
              <div className="flex gap-2">
                <Select onValueChange={handleIndustrySelect}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  placeholder="Or add a custom industry..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCustomIndustryAdd}
                  disabled={!customIndustry.trim()}
                >
                  Add
                </Button>
              </div>

              {selectedIndustries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedIndustries.map((industry) => (
                    <div 
                      key={industry}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm"
                    >
                      {industry}
                      <button
                        type="button"
                        onClick={() => removeIndustry(industry)}
                        className="ml-1 rounded-full hover:bg-primary-foreground/20"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Platform Selection */}
            <div className="space-y-3">
              <Label>Primary Platforms * (select multiple)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platformOptions.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                    <Checkbox 
                      id={`platform-${platform}`}
                      checked={primaryPlatforms.includes(platform)}
                      onCheckedChange={() => handlePlatformToggle(platform)}
                    />
                    <Label 
                      htmlFor={`platform-${platform}`}
                      className="cursor-pointer flex-grow text-sm"
                    >
                      {platform}
                    </Label>
                  </div>
                ))}
                
                {/* Other Platform Option */}
                <div className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                  <Checkbox 
                    id="platform-other"
                    checked={showOtherPlatform}
                    onCheckedChange={() => handlePlatformToggle('Other')}
                  />
                  <Label 
                    htmlFor="platform-other"
                    className="cursor-pointer flex-grow text-sm"
                  >
                    Other
                  </Label>
                </div>
              </div>

              {showOtherPlatform && (
                <div className="flex gap-2">
                  <Input
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    placeholder="Enter custom platform name..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCustomPlatformAdd}
                    disabled={!customPlatform.trim()}
                  >
                    Add
                  </Button>
                </div>
              )}

              {/* Selected Platforms Display */}
              {primaryPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {primaryPlatforms.map((platform) => (
                    <div 
                      key={platform}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                    >
                      {platform}
                      <button
                        type="button"
                        onClick={() => removePlatform(platform)}
                        className="ml-1 rounded-full hover:bg-blue-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Type Selection */}
            <div className="space-y-3">
              <Label>Content Formats * (select multiple)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {contentTypeOptions.map((contentType) => (
                  <div key={contentType} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                    <Checkbox 
                      id={`content-${contentType}`}
                      checked={contentTypes.includes(contentType)}
                      onCheckedChange={() => handleContentTypeToggle(contentType)}
                    />
                    <Label 
                      htmlFor={`content-${contentType}`}
                      className="cursor-pointer flex-grow text-sm"
                    >
                      {contentType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="audienceType">Audience Type</Label>
                <Select value={audienceType} onValueChange={setAudienceType}>
                  <SelectTrigger id="audienceType">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gen Z">Gen Z</SelectItem>
                    <SelectItem value="Millennials">Millennials</SelectItem>
                    <SelectItem value="Gen X">Gen X</SelectItem>
                    <SelectItem value="Baby Boomers">Baby Boomers</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Niche">Niche</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audienceLocation">Primary Audience Location</Label>
                <Input
                  id="audienceLocation"
                  value={audienceLocation}
                  onChange={(e) => setAudienceLocation(e.target.value)}
                  placeholder="e.g. United States, Global, etc."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Complete Profile & Get Ready for Brands!'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
