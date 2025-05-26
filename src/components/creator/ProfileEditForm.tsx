
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreatorProfile } from '@/hooks/useCreatorProfile';
import { CreatorTypeDropdown } from '@/components/creator/setup/CreatorTypeDropdown';
import OAuthConnectButtons from '@/components/creator/OAuthConnectButtons';
import { BasicInfoSection } from './form-sections/BasicInfoSection';
import { IndustryContentSection } from './form-sections/IndustryContentSection';

export interface ProfileEditFormProps {
  profile: CreatorProfile;
  isLoading: boolean;
  onSubmit: (updatedProfile: Partial<CreatorProfile>) => Promise<void>;
  onCancel: () => void;
}

const ProfileEditForm = ({ profile, isLoading, onSubmit, onCancel }: ProfileEditFormProps) => {
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [primaryPlatforms, setPrimaryPlatforms] = useState<string[]>(
    profile.primaryPlatform ? profile.primaryPlatform.split(', ').filter(p => p.trim()) : []
  );
  const [contentTypes, setContentTypes] = useState<string[]>(
    profile.contentType ? profile.contentType.split(', ').filter(c => c.trim()) : []
  );
  const [audienceType, setAudienceType] = useState(profile.audienceType || '');
  const [audienceLocation, setAudienceLocation] = useState(profile.audienceLocation?.primary || 'Global');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(profile.industries || []);
  const [creatorType, setCreatorType] = useState(profile.creatorType || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please fill in your first and last name');
      setIsSubmitting(false);
      return;
    }

    if (selectedIndustries.length === 0) {
      alert('Please select at least one industry');
      setIsSubmitting(false);
      return;
    }

    if (primaryPlatforms.length === 0) {
      alert('Please select at least one platform');
      setIsSubmitting(false);
      return;
    }

    if (contentTypes.length === 0) {
      alert('Please select at least one content format');
      setIsSubmitting(false);
      return;
    }

    if (!creatorType) {
      alert('Please select your creator type');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Form submission data:', {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection 
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        bio={bio}
        setBio={setBio}
      />

      <Card>
        <CardContent className="pt-6">
          <CreatorTypeDropdown selected={creatorType} setSelected={setCreatorType} />
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

      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? 'Saving...' : 'Complete Profile & Get Ready for Brands!'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
