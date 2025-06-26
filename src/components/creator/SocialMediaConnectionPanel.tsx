
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle, Instagram, Youtube, Twitter, Linkedin, Info, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'Enter your Instagram handle (e.g., opensocials)' },
  { value: 'tiktok', label: 'TikTok', icon: Twitter, placeholder: 'Enter your TikTok handle' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'Enter your YouTube channel handle' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'Enter your LinkedIn handle' },
];

export const SocialMediaConnectionPanel: React.FC = () => {
  const { user } = useUnifiedAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [handle, setHandle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTriggerLoading, setIsTriggerLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error' | 'existing'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successDetails, setSuccessDetails] = useState<{
    message: string;
    isExisting: boolean;
    note?: string;
    scrapingTriggered?: boolean;
  } | null>(null);

  const handleConnect = async () => {
    if (!user || !selectedPlatform || !handle.trim()) {
      toast.error('Please select a platform and enter your handle');
      return;
    }

    setIsLoading(true);
    setConnectionStatus('idle');
    setErrorMessage('');
    setSuccessDetails(null);

    try {
      console.log('🔗 Starting social account connection:', { 
        platform: selectedPlatform, 
        handle: handle.trim(),
        userId: user.id
      });

      // Get the current session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found. Please refresh the page and try again.');
      }

      // Call the edge function with proper authentication
      const { data, error } = await supabase.functions.invoke('connect-social-account', {
        body: {
          platform: selectedPlatform,
          handle: handle.trim()
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      console.log('📡 Edge function response:', { data, error });

      if (error) {
        console.error('❌ Function invocation error:', error);
        throw new Error(`Connection failed: ${error.message || 'Unknown error occurred'}`);
      }

      if (!data) {
        throw new Error('No response received from the connection service');
      }

      if (data.success) {
        console.log('✅ Social account operation successful:', data);
        
        const isExisting = data.isExisting || false;
        
        setConnectionStatus(isExisting ? 'existing' : 'success');
        setSuccessDetails({
          message: data.message || `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} account connected`,
          isExisting,
          note: data.note,
          scrapingTriggered: data.scraping_triggered
        });
        
        // Show appropriate success toast
        if (isExisting) {
          toast.success(data.message || `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} account is already connected!`);
        } else {
          toast.success(data.message || `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} account connected successfully!`);
        }
        
        // Reset form after successful connection
        setSelectedPlatform('');
        setHandle('');
      } else {
        console.error('❌ Connection service returned failure:', data);
        throw new Error(data?.error || 'Failed to connect social account');
      }

    } catch (err) {
      console.error('💥 Connection error:', err);
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      setConnectionStatus('error');
      
      // Show specific error messages
      if (errorMsg.includes('No valid session')) {
        toast.error('Session expired - please refresh the page and try again');
      } else if (errorMsg.includes('Authorization required')) {
        toast.error('Authentication failed - please refresh and try again');
      } else if (errorMsg.includes('not currently supported')) {
        toast.error(`${selectedPlatform} connections are not available yet`);
      } else {
        toast.error(`Connection failed: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerScraping = async () => {
    setIsTriggerLoading(true);
    
    try {
      console.log('🔧 Triggering social scraping...');
      
      const { data, error } = await supabase.functions.invoke('trigger-social-scraping');
      
      if (error) {
        console.error('❌ Trigger scraping error:', error);
        toast.error(`Failed to trigger scraping: ${error.message}`);
        return;
      }
      
      if (data?.success) {
        console.log('✅ Scraping triggered:', data);
        toast.success(`Triggered scraping for ${data.triggered} accounts`);
        
        if (data.errors > 0) {
          toast.warning(`${data.errors} accounts had errors - check logs`);
        }
      } else {
        toast.error(data?.error || 'Failed to trigger scraping');
      }
      
    } catch (err) {
      console.error('💥 Trigger scraping error:', err);
      toast.error('Failed to trigger scraping');
    } finally {
      setIsTriggerLoading(false);
    }
  };

  const selectedPlatformConfig = PLATFORM_OPTIONS.find(p => p.value === selectedPlatform);
  const Icon = selectedPlatformConfig?.icon;

  const getStatusDisplay = () => {
    switch (connectionStatus) {
      case 'success':
        return (
          <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-800 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <div className="text-sm">
              <span className="text-green-100 font-medium">{successDetails?.message}</span>
              {successDetails?.note && (
                <p className="text-green-200 text-xs mt-1">{successDetails.note}</p>
              )}
              {successDetails?.scrapingTriggered && (
                <p className="text-green-300 text-xs mt-1">✅ Analytics scraping started</p>
              )}
            </div>
          </div>
        );
      case 'existing':
        return (
          <div className="flex items-center gap-2 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
            <Info className="h-4 w-4 text-blue-400" />
            <div className="text-sm">
              <span className="text-blue-100 font-medium">{successDetails?.message}</span>
              <p className="text-blue-200 text-xs mt-1">{successDetails?.note || 'Your analytics are being updated automatically.'}</p>
              {successDetails?.scrapingTriggered && (
                <p className="text-blue-300 text-xs mt-1">✅ Fresh scraping triggered</p>
              )}
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-100 font-medium">{errorMessage}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
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

          {getStatusDisplay()}

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

      {/* Admin trigger button for testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Manual Scraping Trigger
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manually trigger scraping for accounts that haven't been processed yet.
          </p>
        </CardHeader>
        
        <CardContent>
          <Button
            onClick={handleTriggerScraping}
            disabled={isTriggerLoading}
            variant="outline"
            className="w-full"
          >
            {isTriggerLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Triggering Scraping...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Trigger Social Media Scraping
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
