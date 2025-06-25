
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const SocialMediaConnectionPanel = () => {
  const { user, creatorProfile } = useUnifiedAuth();

  const platforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      connected: creatorProfile?.platforms?.includes('instagram') || false,
      handle: creatorProfile?.social_handles?.instagram || null,
    },
    {
      name: 'TikTok',
      icon: Twitter,
      connected: creatorProfile?.platforms?.includes('tiktok') || false,
      handle: creatorProfile?.social_handles?.tiktok || null,
    },
    {
      name: 'YouTube',
      icon: Youtube,
      connected: creatorProfile?.platforms?.includes('youtube') || false,
      handle: creatorProfile?.social_handles?.youtube || null,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      connected: creatorProfile?.platforms?.includes('linkedin') || false,
      handle: creatorProfile?.social_handles?.linkedin || null,
    },
  ];

  const handleConnect = (platformName: string) => {
    // Placeholder for connection logic
    console.log(`Connecting to ${platformName}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Connections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <IconComponent className="w-5 h-5" />
                <div>
                  <h4 className="font-medium">{platform.name}</h4>
                  {platform.connected && platform.handle && (
                    <p className="text-sm text-muted-foreground">@{platform.handle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {platform.connected ? (
                  <Badge variant="default">Connected</Badge>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleConnect(platform.name)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SocialMediaConnectionPanel;
