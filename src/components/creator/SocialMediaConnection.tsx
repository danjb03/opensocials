
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon, Instagram, Youtube, Twitter, Loader2 } from 'lucide-react';
import { useInsightIQData } from '@/hooks/useInsightIQData';

interface SocialMediaConnectionProps {
  onConnectionSuccess?: () => void;
}

export const SocialMediaConnection = ({ onConnectionSuccess }: SocialMediaConnectionProps) => {
  const { fetchCreatorData, getPlatformData } = useInsightIQData();
  const [usernames, setUsernames] = useState({
    instagram: '',
    youtube: '',
    tiktok: '',
    twitter: ''
  });

  const platforms = [
    { name: 'Instagram', key: 'instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { name: 'YouTube', key: 'youtube', icon: Youtube, color: 'bg-red-500' },
    { name: 'TikTok', key: 'tiktok', icon: LinkIcon, color: 'bg-black' },
    { name: 'Twitter', key: 'twitter', icon: Twitter, color: 'bg-blue-500' }
  ];

  const handleUsernameChange = (platform: string, value: string) => {
    setUsernames(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleConnect = async (platform: string) => {
    const username = usernames[platform as keyof typeof usernames];
    if (!username.trim()) {
      return;
    }

    await fetchCreatorData(platform, username);
    
    // Call success callback if provided
    if (onConnectionSuccess) {
      onConnectionSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Connect Your Social Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your username to connect your social media accounts and showcase your reach to brands.
          </p>
          
          <div className="space-y-4">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              const platformData = getPlatformData(platform.key);
              const isLoading = platformData?.isLoading || false;
              const hasData = !!platformData?.data;
              const hasError = !!platformData?.error;
              
              return (
                <div key={platform.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${platform.color}`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{platform.name}</span>
                    {hasData && (
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Enter your ${platform.name} username`}
                      value={usernames[platform.key as keyof typeof usernames]}
                      onChange={(e) => handleUsernameChange(platform.key, e.target.value)}
                      className={hasError ? 'border-red-500' : ''}
                    />
                    <Button
                      onClick={() => handleConnect(platform.key)}
                      disabled={isLoading || !usernames[platform.key as keyof typeof usernames].trim()}
                      className="shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                  
                  {hasError && (
                    <p className="text-xs text-red-600">{platformData?.error}</p>
                  )}
                  
                  {hasData && (
                    <div className="text-xs text-muted-foreground">
                      @{platformData?.username} • {platformData?.data?.followers.toLocaleString()} followers
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Real-time analytics powered by InsightIQ
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
