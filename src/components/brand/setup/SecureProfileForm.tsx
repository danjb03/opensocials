
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { sanitizeString, sanitizeHtml, validateUrl, sanitizeUrl } from '@/utils/security';

interface BrandProfile {
  companyName: string;
  industry: string;
  website: string;
  bio: string;
  budgetRange: string;
  brandGoal: string;
}

interface SecureProfileFormProps {
  initialData?: Partial<BrandProfile>;
  onSave: (profile: BrandProfile) => Promise<void>;
  isLoading?: boolean;
}

export const SecureProfileForm: React.FC<SecureProfileFormProps> = ({
  initialData = {},
  onSave,
  isLoading = false
}) => {
  const [profile, setProfile] = useState<BrandProfile>({
    companyName: initialData.companyName || '',
    industry: initialData.industry || '',
    website: initialData.website || '',
    bio: initialData.bio || '',
    budgetRange: initialData.budgetRange || '',
    brandGoal: initialData.brandGoal || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BrandProfile, string>>>({});

  const validateField = (field: keyof BrandProfile, value: string): string | null => {
    switch (field) {
      case 'companyName':
        if (!value.trim()) return 'Company name is required';
        if (value.length > 100) return 'Company name must be less than 100 characters';
        break;
      case 'website':
        if (value && !validateUrl(value)) return 'Please enter a valid website URL';
        break;
      case 'bio':
        if (value.length > 500) return 'Bio must be less than 500 characters';
        break;
      case 'brandGoal':
        if (value.length > 1000) return 'Brand goal must be less than 1000 characters';
        break;
    }
    return null;
  };

  const handleInputChange = (field: keyof BrandProfile, value: string) => {
    // Apply appropriate sanitization based on field type
    let sanitizedValue = value;
    
    switch (field) {
      case 'companyName':
      case 'industry':
      case 'budgetRange':
        sanitizedValue = sanitizeString(value, 100);
        break;
      case 'website':
        sanitizedValue = value; // Don't sanitize URL until validation
        break;
      case 'bio':
        sanitizedValue = sanitizeHtml(value, { 
          allowedTags: ['br', 'strong', 'em'],
          maxLength: 500 
        });
        break;
      case 'brandGoal':
        sanitizedValue = sanitizeString(value, 1000);
        break;
    }

    setProfile(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // Validate and set errors
    const error = validateField(field, sanitizedValue);
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    const newErrors: Partial<Record<keyof BrandProfile, string>> = {};
    let hasErrors = false;

    for (const [field, value] of Object.entries(profile)) {
      const error = validateField(field as keyof BrandProfile, value);
      if (error) {
        newErrors[field as keyof BrandProfile] = error;
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      toast.error('Please fix the validation errors before saving.');
      return;
    }

    // Final sanitization before saving
    const sanitizedProfile: BrandProfile = {
      companyName: sanitizeString(profile.companyName, 100),
      industry: sanitizeString(profile.industry, 100),
      website: profile.website ? sanitizeUrl(profile.website) : '',
      bio: sanitizeHtml(profile.bio, { 
        allowedTags: ['br', 'strong', 'em'],
        maxLength: 500 
      }),
      budgetRange: sanitizeString(profile.budgetRange, 50),
      brandGoal: sanitizeString(profile.brandGoal, 1000)
    };

    try {
      await onSave(sanitizedProfile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const industries = [
    'Technology', 'Fashion', 'Beauty', 'Food & Beverage', 'Travel',
    'Fitness', 'Gaming', 'Education', 'Finance', 'Healthcare', 'Other'
  ];

  const budgetRanges = [
    'Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', 
    '$10,000 - $25,000', '$25,000 - $50,000', 'Over $50,000'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          type="text"
          value={profile.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={errors.companyName ? 'border-red-500' : ''}
          maxLength={100}
          required
        />
        {errors.companyName && (
          <p className="text-sm text-red-500">{errors.companyName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select 
          value={profile.industry} 
          onValueChange={(value) => handleInputChange('industry', value)}
        >
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

      <div className="space-y-2">
        <Label htmlFor="website">Website URL</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://www.yourcompany.com"
          value={profile.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className={errors.website ? 'border-red-500' : ''}
        />
        {errors.website && (
          <p className="text-sm text-red-500">{errors.website}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Company Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about your company and what makes it special..."
          value={profile.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className={errors.bio ? 'border-red-500' : ''}
          rows={4}
        />
        <p className="text-sm text-muted-foreground">
          {profile.bio.length}/500 characters
        </p>
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetRange">Budget Range</Label>
        <Select 
          value={profile.budgetRange} 
          onValueChange={(value) => handleInputChange('budgetRange', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your typical campaign budget" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brandGoal">Brand Goals</Label>
        <Textarea
          id="brandGoal"
          placeholder="What are your main marketing and brand goals?"
          value={profile.brandGoal}
          onChange={(e) => handleInputChange('brandGoal', e.target.value)}
          className={errors.brandGoal ? 'border-red-500' : ''}
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          {profile.brandGoal.length}/1000 characters
        </p>
        {errors.brandGoal && (
          <p className="text-sm text-red-500">{errors.brandGoal}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
};
