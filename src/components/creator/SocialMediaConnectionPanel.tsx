
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'Enter your Instagram handle (e.g., opensocials)' },
  { value: 'tiktok', label: 'TikTok', icon: Twitter, placeholder: 'Enter your TikTok handle' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'Enter your YouTube channel handle' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'Enter your LinkedIn handle' },
];

export const SocialMediaConnectionPanel: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [handle, setHandle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleConnect = async () => {
    if (!user || !selectedPlatform || !handle.trim()) {
      toast.error('Please select a platform and enter your handle');
      return;
    }

    setIsLoading(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      console.log('Connecting social account:', { platform: selectedPlatform, handle: handle.trim() });

      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      // Call the connect-social-account edge function
      const { data, error } = await supabase.functions.invoke('connect-social-account', {
        body: {
          platform: selectedPlatform,
          handle: handle.trim(),
          creator_id: user.id
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to connect social account');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to connect social account');
      }

      console.log('Social account connected successfully:', data);
      
      setConnectionStatus('success');
      toast.success(`${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} account connected successfully!`);
      
      // Reset form
      setSelectedPlatform('');
      setHandle('');

    } catch (err) {
      console.error('Connection error:', err);
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      setConnectionStatus('error');
      toast.error(`Failed to connect account: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlatformConfig = PLATFORM_OPTIONS.find(p => p.value === selectedPlatform);
  const Icon = selectedPlatformConfig?.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5" />
          Connect Social Media Account
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect your social media accounts to pull in real-time analytics and metrics.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      <PlatformIcon className="h-4 w-4" />
                      {platform.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {selectedPlatform && (
          <div className="space-y-2">
            <Label htmlFor="handle" className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {selectedPlatformConfig?.label} Handle
            </Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={selectedPlatformConfig?.placeholder || 'Enter your handle'}
              disabled={isLoading}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter just your handle without @ symbol (e.g., "opensocials")
            </p>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-800" />
            <span className="text-sm text-red-800 font-medium">{errorMessage}</span>
          </div>
        )}

        {connectionStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">
              Account connected successfully! Metrics will be available within 5-10 minutes.
            </span>
          </div>
        )}

        <Button
          onClick={handleConnect}
          disabled={!selectedPlatform || !handle.trim() || isLoading}
          className="w-full bg-white text-black hover:bg-gray-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Account'
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>We only collect public data from your social media profiles.</p>
          <p>Your account credentials are never stored or accessed.</p>
        </div>
      </CardContent>
    </Card>
  );
};
