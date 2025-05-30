
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkIcon, Instagram, Youtube, Twitter } from 'lucide-react';

interface SocialMediaConnectionProps {
  onConnectionSuccess?: () => void;
}

export const SocialMediaConnection = ({ onConnectionSuccess }: SocialMediaConnectionProps) => {
  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
    { name: 'TikTok', icon: LinkIcon, color: 'bg-black' },
    { name: 'Twitter', icon: Twitter, color: 'bg-blue-500' }
  ];

  const handleConnect = (platform: string) => {
    // TODO: Implement InsightIQ API integration
    console.log(`Connecting to ${platform} via InsightIQ API`);
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
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Button
                  key={platform.name}
                  variant="outline"
                  onClick={() => handleConnect(platform.name)}
                  className="flex items-center gap-2 h-12"
                >
                  <div className={`p-1 rounded ${platform.color}`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  {platform.name}
                </Button>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              New simplified connection system coming soon - no OAuth required!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
