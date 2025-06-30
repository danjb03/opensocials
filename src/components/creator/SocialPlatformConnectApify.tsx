import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', placeholder: 'Enter your Instagram handle or URL' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'Enter your TikTok handle or URL' },
  { value: 'youtube', label: 'YouTube', placeholder: 'Enter your YouTube channel handle or URL' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'Enter LinkedIn profile URL or handle' },
  { value: 'twitter', label: 'X.com (Twitter)', placeholder: 'Enter your X.com handle' },
];

interface SocialPlatformConnectApifyProps {
  onSuccess?: () => void;
}

export const SocialPlatformConnectApify: React.FC<SocialPlatformConnectApifyProps> = ({ onSuccess }) => {
  const { user } = useUnifiedAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [handle, setHandle] = useState<string>('');

  const handleConnect = async () => {
    if (!user || !selectedPlatform || !handle.trim()) {
      toast.error('Please select a platform and enter your handle/URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'connect-social-account',
        {
          body: {
            platform: selectedPlatform,
            handle: handle.trim(),
            creator_id: user.id,
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message || 'Failed to connect profile');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to connect social account');
      }

      setIsSuccess(true);
      toast.success(`${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} account connected successfully!`);
      setSelectedPlatform('');
      setHandle('');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Social account connection error:', err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlatformConfig = PLATFORM_OPTIONS.find(p => p.value === selectedPlatform);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📱 Connect Social Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPlatform && (
          <div className="space-y-2">
            <Label htmlFor="handle">
              {selectedPlatform === 'linkedin' ? 'Profile URL or Handle' : 'Handle/Username'}
            </Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={selectedPlatformConfig?.placeholder || 'Enter your handle'}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {selectedPlatform === 'linkedin' 
                ? 'Enter your LinkedIn profile URL (e.g., https://linkedin.com/in/yourname) or just your handle'
                : `Enter your ${selectedPlatformConfig?.label} username with or without the @ symbol`}
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Profile connected successfully!</span>
          </div>
        )}

        <Button
          onClick={handleConnect}
          disabled={!selectedPlatform || !handle.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Profile'
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Your public profile data will be securely fetched using Apify and stored to showcase your analytics to potential brand partners. No login required.
        </div>
      </CardContent>
    </Card>
  );
};
