
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    PhylloConnect: any;
  }
}

interface SocialMediaConnectionProps {
  onConnectionSuccess?: () => void;
}

export const SocialMediaConnection = ({ onConnectionSuccess }: SocialMediaConnectionProps) => {
  const [isPhylloLoading, setIsPhylloLoading] = useState(false);
  const [phylloScriptLoaded, setPhylloScriptLoaded] = useState(false);
  const { user } = useAuth();

  const loadPhylloScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (phylloScriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.staging.getphyllo.com/connect/v2/phyllo-connect.js';
      script.async = true;
      script.onload = () => {
        setPhylloScriptLoaded(true);
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Phyllo Connect script'));
      };
      document.head.appendChild(script);
    });
  };

  const initializePhylloConnect = async () => {
    if (!user?.id) {
      toast.error('Please log in to connect your social accounts');
      return;
    }

    setIsPhylloLoading(true);
    
    try {
      await loadPhylloScript();
      
      console.log('Initializing Phyllo Connect for user:', user.id);
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: user.id,
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOThlZDQyZGQtNGVkZS00YjNiLWEwMGQtMDA1NGZjODk1YTZhIiwidGVuYW50X2lkIjoiYjJmMWEzN2ItYjliZi00YTEzLTlmYTctM2QwNTA1YjRhN2EyIiwidGVuYW50X2FwcF9pZCI6IjAyZTEzZTYyLTRjYjAtNDA2Zi1iYTUzLTE1MDBjNzQzMzQwZSIsInByb2R1Y3RzIjpbIkVOR0FHRU1FTlRfQVVESUVOQ0UiLCJJREVOVElUWSIsIkVOR0FHRU1FTlQiXSwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2V0cGh5bGxvLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmdldHBoeWxsby5jb20vdjEvaW50ZXJuYWwiLCJpYXQiOjE3NDgyOTQ2NjkuNzAxOTE3LCJleHAiOjE3NDg4OTk0NjkuNzAxOTA2fQ.82YCC8_JQkHwBKPHUitH6gugyc9W67FxetSlI70tWaw"
      });

      phylloConnect.on('accountConnected', async (accountId: string, workplatformId: string, userId: string) => {
        console.log('Account Connected:', { accountId, workplatformId, userId });

        try {
          console.log('Calling storeConnectedAccount function...');
          
          const { data, error } = await supabase.functions.invoke('storeConnectedAccount', {
            body: {
              user_id: user.id,
              platform: workplatformId,
              account_id: accountId,
              workplatform_id: workplatformId
            }
          });
          
          if (error) {
            console.error('Error storing connected account:', error);
            throw error;
          }
          
          console.log('Successfully stored connected account:', data);
          toast.success('Social account connected successfully!');
          onConnectionSuccess?.();
        } catch (error) {
          console.error('Error storing connected account:', error);
          toast.error('Connected to platform but failed to save connection. Please try again.');
        }
      });

      phylloConnect.on('error', (reason: string) => {
        console.error('Phyllo Connect error:', reason);
        toast.error(`Failed to connect social account: ${reason}`);
        setIsPhylloLoading(false);
      });

      phylloConnect.on('exit', (reason: string) => {
        console.log('Phyllo Connect exit:', reason);
        setIsPhylloLoading(false);
      });

      phylloConnect.open();
    } catch (error) {
      console.error('Error initializing Phyllo Connect:', error);
      toast.error('Failed to load social account connection. Please try again.');
      setIsPhylloLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="border-t pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Connect Your Social Media</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please log in to connect your social media accounts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Connect Your Social Media</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your social media accounts to showcase your reach and get ready for brand collaborations.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={initializePhylloConnect}
            disabled={isPhylloLoading}
            className="flex items-center gap-2"
          >
            <LinkIcon className="h-4 w-4" />
            {isPhylloLoading ? 'Connecting...' : 'Connect Your Social Platforms'}
          </Button>
        </div>
      </div>
    </div>
  );
};
