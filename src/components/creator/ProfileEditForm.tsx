
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreatorProfile } from '@/hooks/useCreatorProfile';
import { Card, CardContent } from '@/components/ui/card';
import { CreatorIndustrySelector } from '@/components/creator/setup/CreatorIndustrySelector';
import { CreatorTypeSelector } from '@/components/creator/setup/CreatorTypeSelector';

export interface ProfileEditFormProps {
  profile: CreatorProfile;
  isLoading: boolean;
  onSubmit: (updatedProfile: Partial<CreatorProfile>) => Promise<void>;
  onCancel: () => void;
}

const ProfileEditForm = ({ profile, isLoading, onSubmit, onCancel }: ProfileEditFormProps) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [bio, setBio] = useState(profile.bio);
  const [primaryPlatform, setPrimaryPlatform] = useState(profile.primaryPlatform);
  const [contentType, setContentType] = useState(profile.contentType);
  const [audienceType, setAudienceType] = useState(profile.audienceType);
  const [audienceLocation, setAudienceLocation] = useState(profile.audienceLocation.primary);
  const [industries, setIndustries] = useState(profile.industries || []);
  const [creatorType, setCreatorType] = useState(profile.creatorType || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await onSubmit({
      firstName,
      lastName,
      bio,
      primaryPlatform,
      contentType,
      audienceType,
      audienceLocation: {
        ...profile.audienceLocation,
        primary: audienceLocation
      },
      industries,
      creatorType
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
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
          <h3 className="text-lg font-medium mb-4">Creator Type</h3>
          <CreatorTypeSelector selected={creatorType} setSelected={setCreatorType} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Industry & Content</h3>
          <div className="space-y-6">
            <CreatorIndustrySelector 
              selected={industries}
              setSelected={setIndustries}
              maxSelections={3}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryPlatform">Primary Platform</Label>
                <Select value={primaryPlatform} onValueChange={setPrimaryPlatform}>
                  <SelectTrigger id="primaryPlatform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="Twitch">Twitch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Content Format</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short Form Video">Short Form Video</SelectItem>
                    <SelectItem value="Long Form Video">Long Form Video</SelectItem>
                    <SelectItem value="Photos">Photos</SelectItem>
                    <SelectItem value="Live Streaming">Live Streaming</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Text">Text</SelectItem>
                  </SelectContent>
                </Select>
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
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
