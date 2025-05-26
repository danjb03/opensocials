
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const industries = [
  'Fashion', 
  'Beauty & Cosmetics', 
  'Fitness & Health', 
  'Food & Beverage', 
  'Technology',
  'Travel', 
  'Lifestyle', 
  'Gaming', 
  'Music', 
  'Art & Design',
  'Other'
];

interface ProfileBasicInfoProps {
  formData: {
    fullName: string;
    bio: string;
    location: string;
    industry: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const ProfileBasicInfo = ({ formData, onInputChange }: ProfileBasicInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input 
          id="fullName"
          value={formData.fullName}
          onChange={(e) => onInputChange('fullName', e.target.value)}
          placeholder="Your full name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio"
          value={formData.bio}
          onChange={(e) => onInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder="City, Country"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="industry">Industry *</Label>
        <Select value={formData.industry} onValueChange={(value) => onInputChange('industry', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
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
    </>
  );
};
