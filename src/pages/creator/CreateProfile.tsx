
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useCreateProfileForm } from '@/hooks/useCreateProfileForm';
import { ProfileBasicInfo } from '@/components/creator/ProfileBasicInfo';
import { ContentTypeSelection } from '@/components/creator/ContentTypeSelection';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    PhylloConnect: any;
  }
}

const CreateProfile = () => {
  const {
    formData,
    isLoading,
    handleInputChange,
    handleContentTypeToggle,
    handleSubmit
  } = useCreateProfileForm();

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Creator Profile</h1>
          <p className="text-muted-foreground">Tell brands about yourself and your content</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Fill out your profile details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProfileBasicInfo 
                formData={formData}
                onInputChange={handleInputChange}
              />

              <ContentTypeSelection 
                selectedTypes={formData.contentTypes}
                onContentTypeToggle={handleContentTypeToggle}
              />

              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Connect Your Social Media</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your social media accounts to showcase your reach and get ready for brand collaborations.
                    </p>
                    {user ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={initializePhylloConnect}
                        disabled={isPhylloLoading}
                        className="flex items-center gap-2"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {isPhylloLoading ? 'Connecting...' : 'Connect Your Social Accounts'}
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Please log in to connect your social media accounts.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="min-w-32">
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;
