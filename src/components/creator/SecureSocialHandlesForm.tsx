
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sanitizeString, validateSocialHandle } from '@/utils/security';

interface SecureSocialHandlesFormProps {
  formData: {
    instagramHandle: string;
    tiktokHandle: string;
    youtubeHandle: string;
    followers: string;
    avgViews: string;
    engagementRate: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const SecureSocialHandlesForm = ({ formData, onInputChange }: SecureSocialHandlesFormProps) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleInputChange = (field: string, value: string) => {
    let sanitizedValue = value;
    let fieldErrors: string[] = [];

    // Sanitize based on field type
    switch (field) {
      case 'instagramHandle':
      case 'tiktokHandle':
      case 'youtubeHandle':
        sanitizedValue = sanitizeString(value, 50);
        const platform = field.replace('Handle', '');
        const validation = validateSocialHandle(sanitizedValue, platform);
        fieldErrors = validation.errors;
        break;
      case 'followers':
      case 'avgViews':
        // Only allow numbers
        sanitizedValue = value.replace(/[^\d]/g, '');
        if (sanitizedValue && (parseInt(sanitizedValue) < 0 || parseInt(sanitizedValue) > 1000000000)) {
          fieldErrors = ['Value must be between 0 and 1,000,000,000'];
        }
        break;
      case 'engagementRate':
        // Allow numbers and decimal point
        sanitizedValue = value.replace(/[^\d.]/g, '');
        if (sanitizedValue && (parseFloat(sanitizedValue) < 0 || parseFloat(sanitizedValue) > 100)) {
          fieldErrors = ['Engagement rate must be between 0 and 100'];
        }
        break;
      default:
        sanitizedValue = sanitizeString(value);
    }

    // Update errors
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors
    }));

    // Update form data with sanitized value
    onInputChange(field, sanitizedValue);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagramHandle">Instagram Handle</Label>
          <Input 
            id="instagramHandle"
            value={formData.instagramHandle}
            onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
            placeholder="@username"
            maxLength={50}
          />
          {errors.instagramHandle && (
            <Alert variant="destructive">
              <AlertDescription>{errors.instagramHandle[0]}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tiktokHandle">TikTok Handle</Label>
          <Input 
            id="tiktokHandle"
            value={formData.tiktokHandle}
            onChange={(e) => handleInputChange('tiktokHandle', e.target.value)}
            placeholder="@username"
            maxLength={50}
          />
          {errors.tiktokHandle && (
            <Alert variant="destructive">
              <AlertDescription>{errors.tiktokHandle[0]}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="youtubeHandle">YouTube Handle</Label>
          <Input 
            id="youtubeHandle"
            value={formData.youtubeHandle}
            onChange={(e) => handleInputChange('youtubeHandle', e.target.value)}
            placeholder="@channel"
            maxLength={50}
          />
          {errors.youtubeHandle && (
            <Alert variant="destructive">
              <AlertDescription>{errors.youtubeHandle[0]}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="followers">Followers Count</Label>
          <Input 
            id="followers"
            type="text"
            value={formData.followers}
            onChange={(e) => handleInputChange('followers', e.target.value)}
            placeholder="10000"
            maxLength={10}
          />
          {errors.followers && (
            <Alert variant="destructive">
              <AlertDescription>{errors.followers[0]}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="avgViews">Average Views</Label>
          <Input 
            id="avgViews"
            type="text"
            value={formData.avgViews}
            onChange={(e) => handleInputChange('avgViews', e.target.value)}
            placeholder="5000"
            maxLength={10}
          />
          {errors.avgViews && (
            <Alert variant="destructive">
              <AlertDescription>{errors.avgViews[0]}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="engagementRate">Engagement Rate (%)</Label>
          <Input 
            id="engagementRate"
            type="text"
            value={formData.engagementRate}
            onChange={(e) => handleInputChange('engagementRate', e.target.value)}
            placeholder="3.5"
            maxLength={5}
          />
          {errors.engagementRate && (
            <Alert variant="destructive">
              <AlertDescription>{errors.engagementRate[0]}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};
