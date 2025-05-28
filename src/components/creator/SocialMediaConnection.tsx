
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
      if (phylloScriptLoaded || window.PhylloConnect) {
        resolve();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="phyllo-connect"]');
      if (existingScript) {
        setPhylloScriptLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.getphyllo.com/connect/v2/phyllo-connect.js';
      script.async = true;
      script.onload = () => {
        console.log('Phyllo script loaded successfully');
        setPhylloScriptLoaded(true);
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Phyllo script:', error);
        reject(new Error('Failed to load Phyllo Connect script'));
      };
      document.head.appendChild(script);
    });
  };

  const generatePhylloToken = async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    console.log('Generating Phyllo token for user:', user.id);
    
    const { data, error } = await supabase.functions.invoke('generatePhylloToken', {
      body: {
        user_id: user.id,
        user_name: user.email?.split('@')[0] || 'User'
      }
    });

    if (error) {
      console.error('Error generating Phyllo token:', error);
      throw new Error(error.message || 'Failed to generate Phyllo token');
    }

    if (!data?.token) {
      console.error('No token received from generatePhylloToken');
      throw new Error('No token received from server');
    }

    console.log('Successfully generated Phyllo token');
    return data.token;
  };

  const initializePhylloConnect = async () => {
    if (!user?.id) {
      toast.error('Please log in to connect your social accounts');
      return;
    }

    setIsPhylloLoading(true);
    
    try {
      console.log('Loading Phyllo script...');
      await loadPhylloScript();
      
      // Wait a bit for the script to fully initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!window.PhylloConnect) {
        throw new Error('Phyllo Connect library not available');
      }
      
      console.log('Generating fresh Phyllo token...');
      const freshToken = await generatePhylloToken();
      
      console.log('Initializing Phyllo Connect for user:', user.id);
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: user.id,
        token: freshToken
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

      console.log('Opening Phyllo Connect...');
      phylloConnect.open();
    } catch (error) {
      console.error('Error initializing Phyllo Connect:', error);
      toast.error(`Failed to load social account connection: ${error.message}`);
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
