
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon, Instagram, Youtube, Twitter, Loader2, CheckCircle, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
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
    twitter: '',
    linkedin: ''
  });

  const platforms = [
    { 
      name: 'Instagram', 
      key: 'instagram', 
      icon: Instagram, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    { 
      name: 'YouTube', 
      key: 'youtube', 
      icon: Youtube, 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      name: 'TikTok', 
      key: 'tiktok', 
      icon: TikTokIcon, 
      color: 'from-gray-800 to-black',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    { 
      name: 'X', 
      key: 'twitter', 
      icon: Twitter, 
      color: 'from-gray-800 to-black',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    { 
      name: 'LinkedIn', 
      key: 'linkedin', 
      icon: Linkedin, 
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
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
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary rounded-lg">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          Connect Your Social Media
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your username to connect your social media accounts and showcase your reach to brands.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          const platformData = getPlatformData(platform.key);
          const isLoading = platformData?.isLoading || false;
          const hasData = !!platformData?.data;
          const hasError = !!platformData?.error;
          
          return (
            <div key={platform.name} className={`p-4 rounded-xl border transition-all duration-200 ${platform.bgColor} ${platform.borderColor} ${hasData ? 'ring-2 ring-green-200' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{platform.name}</span>
                    {hasData && (
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">Connected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Enter your ${platform.name} username`}
                    value={usernames[platform.key as keyof typeof usernames]}
                    onChange={(e) => handleUsernameChange(platform.key, e.target.value)}
                    className={`bg-white/80 backdrop-blur-sm border-white/50 focus:border-white focus:ring-2 focus:ring-white/20 text-gray-900 placeholder:text-gray-500 ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                </div>
                <Button
                  onClick={() => handleConnect(platform.key)}
                  disabled={isLoading || !usernames[platform.key as keyof typeof usernames].trim()}
                  className={`shrink-0 bg-gradient-to-r ${platform.color} hover:opacity-90 text-white border-0 shadow-md transition-all duration-200`}
                  size="default"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
              
              {hasError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{platformData?.error}</p>
                </div>
              )}
              
              {hasData && (
                <div className="mt-3 p-3 bg-white/50 rounded-lg border border-white/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      @{platformData?.username}
                    </span>
                    <span className="text-sm text-gray-600">
                      {platformData?.data?.followers.toLocaleString()} followers
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <span>Real-time analytics powered by</span>
            <span className="font-semibold text-gray-700">InsightIQ</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
