
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useInsightIQConnect } from '@/hooks/useInsightIQConnect';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', placeholder: 'Enter your Instagram handle' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'Enter your TikTok handle' },
  { value: 'youtube', label: 'YouTube', placeholder: 'Enter your YouTube channel handle' },
  { value: 'twitter', label: 'Twitter/X', placeholder: 'Enter your Twitter/X handle' },
  { value: 'twitch', label: 'Twitch', placeholder: 'Enter your Twitch username' },
  { value: 'facebook', label: 'Facebook', placeholder: 'Enter your Facebook page name' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'Enter LinkedIn profile URL or handle' },
];

interface SocialPlatformConnectProps {
  onSuccess?: () => void;
}

export const SocialPlatformConnect: React.FC<SocialPlatformConnectProps> = ({ onSuccess }) => {
  const { user } = useCreatorAuth();
  const { connect, isLoading, isSuccess, error } = useInsightIQConnect();
  
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [identifier, setIdentifier] = useState<string>('');

  const handleConnect = async () => {
    if (!user || !selectedPlatform || !identifier.trim()) {
      toast.error('Please select a platform and enter your handle/URL');
      return;
    }

    try {
      await connect({
        creator_id: user.id,
        platform: selectedPlatform,
        identifier: identifier.trim(),
      });

      if (isSuccess) {
        toast.success('Social profile connected successfully!');
        setSelectedPlatform('');
        setIdentifier('');
        onSuccess?.();
      }
    } catch (err) {
      console.error('Connection error:', err);
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
            <SelectTrigger>
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
            <Label htmlFor="identifier">
              {selectedPlatform === 'linkedin' ? 'Profile URL or Handle' : 'Handle/Username'}
            </Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={selectedPlatformConfig?.placeholder || 'Enter your handle'}
              disabled={isLoading}
            />
            {selectedPlatform === 'linkedin' && (
              <p className="text-xs text-muted-foreground">
                Enter your LinkedIn profile URL (e.g., https://linkedin.com/in/yourname) or just your handle
              </p>
            )}
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
          disabled={!selectedPlatform || !identifier.trim() || isLoading}
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
          Your profile data will be securely fetched and stored to showcase your analytics to potential brand partners.
        </div>
      </CardContent>
    </Card>
  );
};
