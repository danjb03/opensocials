
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, Youtube, TrendingUp, Users, Heart, Eye } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';

interface SocialAnalyticsProps {
  socialConnections: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    linkedin: boolean;
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
  const platforms = [
    {
      name: 'Instagram',
      key: 'instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      connected: socialConnections.instagram,
      visible: visibilitySettings.showInstagram,
      analytics: platformAnalytics.instagram
    },
    {
      name: 'TikTok',
      key: 'tiktok',
      icon: TikTokIcon,
      color: 'bg-black',
      connected: socialConnections.tiktok,
      visible: visibilitySettings.showTiktok,
      analytics: platformAnalytics.tiktok
    },
    {
      name: 'YouTube',
      key: 'youtube',
      icon: Youtube,
      color: 'bg-red-500',
      connected: socialConnections.youtube,
      visible: visibilitySettings.showYoutube,
      analytics: platformAnalytics.youtube
    }
  ];

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Social Analytics
            </CardTitle>
            <CardDescription className="text-gray-500">
              Your performance across all connected platforms
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {platforms.filter(p => p.connected).length} Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          
          if (!platform.connected) {
            return (
              <div key={platform.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    <p className="text-sm text-gray-500">Not connected</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onConnect(platform.key)}
                  disabled={isLoading}
                  className="border-gray-300 hover:bg-gray-100"
                >
                  Connect
                </Button>
              </div>
            );
          }

          if (!platform.visible || !platform.analytics) {
            return (
              <div key={platform.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    <p className="text-sm text-gray-500">
                      {!platform.visible ? 'Hidden' : 'Analytics loading...'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-gray-300 text-gray-600">
                  Connected
                </Badge>
              </div>
            );
          }

          return (
            <div key={platform.key} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Connected
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="font-semibold text-gray-900">
                    {platform.analytics.followers}
                  </div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="font-semibold text-gray-900">
                    {platform.analytics.engagement}
                  </div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="font-semibold text-green-600">
                    {platform.analytics.growth}
                  </div>
                  <div className="text-xs text-gray-500">Growth</div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SocialAnalytics;
