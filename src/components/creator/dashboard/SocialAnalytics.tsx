
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import AnalyticsModule from '@/components/creator/AnalyticsModule';

declare global {
  interface Window {
    PhylloConnect: any;
  }
}

interface SocialAnalyticsProps {
  socialConnections: {
    instagram?: boolean;
    tiktok?: boolean;
    youtube?: boolean;
    linkedin?: boolean;
  };
  platformAnalytics: {
    instagram?: { followers: string; engagement: string; growth: string };
    tiktok?: { followers: string; engagement: string; growth: string };
    youtube?: { followers: string; engagement: string; growth: string };
  };
  visibilitySettings: {
    showInstagram: boolean;
    showTiktok: boolean;
    showYoutube: boolean;
    showLinkedin: boolean;
    showLocation: boolean;
    showAnalytics: boolean;
  };
  onConnect: (platform: string) => void;
  isLoading: boolean;
}

const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({
  socialConnections,
  platformAnalytics,
  visibilitySettings,
  onConnect,
  isLoading
}) => {
  const [isPhylloLoading, setIsPhylloLoading] = useState(false);
  const [phylloScriptLoaded, setPhylloScriptLoaded] = useState(false);

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
    setIsPhylloLoading(true);
    
    try {
      await loadPhylloScript();
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OS",
        environment: "staging",
        userId: "98ed42dd-4ede-4b3b-a00d-0054fc895a6a",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOThlZDQyZGQtNGVkZS00YjNiLWEwMGQtMDA1NGZjODk1YTZhIiwidGVuYW50X2lkIjoiYjJmMWEzN2ItYjliZi00YTEzLTlmYTctM2QwNTA1YjRhN2EyIiwidGVuYW50X2FwcF9pZCI6IjAyZTEzZTYyLTRjYjAtNDA2Zi1iYTUzLTE1MDBjNzQzMzQwZSIsInByb2R1Y3RzIjpbIkVOR0FHRU1FTlRfQVVESUVOQ0UiLCJJREVOVElUWSIsIkVOR0FHRU1FTlQiXSwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2V0cGh5bGxvLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmdldHBoeWxsby5jb20vdjEvaW50ZXJuYWwiLCJpYXQiOjE3NDgyOTQ2NjkuNzAxOTE3LCJleHAiOjE3NDg4OTk0NjkuNzAxOTA2fQ.82YCC8_JQkHwBKPHUitH6gugyc9W67FxetSlI70tWaw"
      });

      phylloConnect.on('accountConnected', async (accountId: string, workplatformId: string, userId: string) => {
        console.log('Account Connected:', { accountId, workplatformId, userId });

        try {
          const response = await fetch('https://pcnrnciwgdrukzciwexi.functions.supabase.co/storeConnectedAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              platform: workplatformId,
              account_id: accountId,
              workplatform_id: workplatformId
            })
          });
          
          if (response.ok) {
            toast.success('Social account connected successfully!');
            // Trigger the onConnect callback to refresh data
            onConnect(workplatformId);
          } else {
            throw new Error('Failed to store account connection');
          }
        } catch (error) {
          console.error('Error storing connected account:', error);
          toast.error('Failed to save account connection');
        }
      });

      phylloConnect.on('error', (reason: string) => {
        console.log('Phyllo Connect error:', reason);
        toast.error('Failed to connect social account');
        setIsPhylloLoading(false);
      });

      phylloConnect.on('exit', (reason: string) => {
        console.log('Phyllo Connect exit:', reason);
        setIsPhylloLoading(false);
      });

      phylloConnect.open();
    } catch (error) {
      console.error('Error initializing Phyllo Connect:', error);
      toast.error('Failed to load social account connection');
      setIsPhylloLoading(false);
    }
  };

  return (
    <>
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
              disabled={isPhylloLoading || isLoading}
              className="flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              {isPhylloLoading ? 'Connecting...' : 'Connect Your Social Accounts'}
            </Button>
          </div>
        </div>
      </div>
      
      {socialConnections.instagram && (
        <AnalyticsModule 
          platform="Instagram" 
          metrics={{
            followers: platformAnalytics.instagram?.followers || '15.2K',
            engagement: platformAnalytics.instagram?.engagement || '3.2%',
            views: '5,600 avg',
            likes: '1,200 avg',
            verified: true,
            growthRate: platformAnalytics.instagram?.growth || '+2.5%'
          }}
          isVisible={visibilitySettings.showInstagram}
        />
      )}
      
      {socialConnections.tiktok && (
        <AnalyticsModule 
          platform="TikTok" 
          metrics={{
            followers: platformAnalytics.tiktok?.followers || '22.4K',
            engagement: platformAnalytics.tiktok?.engagement || '5.7%',
            views: '8,900 avg',
            likes: '2,100 avg',
            verified: false,
            growthRate: platformAnalytics.tiktok?.growth || '+4.1%'
          }}
          isVisible={visibilitySettings.showTiktok}
        />
      )}
      
      {socialConnections.youtube && (
        <AnalyticsModule 
          platform="YouTube" 
          metrics={{
            followers: platformAnalytics.youtube?.followers || '8.7K',
            engagement: platformAnalytics.youtube?.engagement || '2.8%',
            views: '3,200 avg',
            likes: '780 avg',
            verified: true,
            growthRate: platformAnalytics.youtube?.growth || '+1.2%'
          }}
          isVisible={visibilitySettings.showYoutube}
        />
      )}
    </>
  );
};

export default SocialAnalytics;
