
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { sanitizeSocialHandle, validateSocialHandle } from '@/utils/security';

interface SocialHandles {
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  twitter: string;
}

interface SecureSocialHandlesFormProps {
  initialHandles?: Partial<SocialHandles>;
  onSave: (handles: SocialHandles) => Promise<void>;
  isLoading?: boolean;
}

export const SecureSocialHandlesForm: React.FC<SecureSocialHandlesFormProps> = ({
  initialHandles = {},
  onSave,
  isLoading = false
}) => {
  const [handles, setHandles] = useState<SocialHandles>({
    instagram: initialHandles.instagram || '',
    tiktok: initialHandles.tiktok || '',
    youtube: initialHandles.youtube || '',
    linkedin: initialHandles.linkedin || '',
    twitter: initialHandles.twitter || ''
  });

  const [errors, setErrors] = useState<Partial<SocialHandles>>({});

  const validateHandle = (platform: keyof SocialHandles, value: string): string | null => {
    if (!value) return null; // Empty handles are allowed
    
    if (!validateSocialHandle(value)) {
      return `Invalid ${platform} handle. Use only letters, numbers, dots, and underscores.`;
    }
    
    return null;
  };

  const handleInputChange = (platform: keyof SocialHandles, value: string) => {
    // Sanitize input immediately
    const sanitized = sanitizeSocialHandle(value);
    
    setHandles(prev => ({
      ...prev,
      [platform]: sanitized
    }));

    // Validate and set errors
    const error = validateHandle(platform, sanitized);
    setErrors(prev => ({
      ...prev,
      [platform]: error || undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    const newErrors: Partial<SocialHandles> = {};
    let hasErrors = false;

    for (const [platform, handle] of Object.entries(handles)) {
      const error = validateHandle(platform as keyof SocialHandles, handle);
      if (error) {
        newErrors[platform as keyof SocialHandles] = error;
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      toast.error('Please fix the validation errors before saving.');
      return;
    }

    // Sanitize all handles one final time before saving
    const sanitizedHandles: SocialHandles = {
      instagram: sanitizeSocialHandle(handles.instagram),
      tiktok: sanitizeSocialHandle(handles.tiktok),
      youtube: sanitizeSocialHandle(handles.youtube),
      linkedin: sanitizeSocialHandle(handles.linkedin),
      twitter: sanitizeSocialHandle(handles.twitter)
    };

    try {
      await onSave(sanitizedHandles);
      toast.success('Social handles updated successfully!');
    } catch (error) {
      console.error('Error saving social handles:', error);
      toast.error('Failed to save social handles. Please try again.');
    }
  };

  const platforms = [
    { key: 'instagram' as const, label: 'Instagram', placeholder: 'username' },
    { key: 'tiktok' as const, label: 'TikTok', placeholder: 'username' },
    { key: 'youtube' as const, label: 'YouTube', placeholder: 'channel' },
    { key: 'linkedin' as const, label: 'LinkedIn', placeholder: 'profile' },
    { key: 'twitter' as const, label: 'Twitter', placeholder: 'username' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        {platforms.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                @
              </span>
              <Input
                id={key}
                type="text"
                placeholder={placeholder}
                value={handles[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className={`pl-8 ${errors[key] ? 'border-red-500' : ''}`}
                maxLength={30}
              />
            </div>
            {errors[key] && (
              <p className="text-sm text-red-500">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Social Handles'}
      </Button>
    </form>
  );
};
