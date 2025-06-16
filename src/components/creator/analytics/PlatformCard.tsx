
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Camera, Play, MessageCircle, Eye, Heart } from 'lucide-react';
import { PLATFORM_CONFIG, formatNumber, formatPercentage } from './utils';

interface PlatformCardProps {
  platform: any;
  index: number;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, index }) => {
  const config = PLATFORM_CONFIG[platform.platform as keyof typeof PLATFORM_CONFIG];
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return Camera;
      case 'Play': return Play;
      case 'MessageCircle': return MessageCircle;
      case 'Users': return Users;
      default: return Users;
    }
  };
  
  const Icon = getIcon(config?.icon || 'Users');
  
  return (
    <Card key={index} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg text-white ${config?.color || 'bg-gray-500'}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{config?.name || platform.platform}</CardTitle>
              <p className="text-sm text-muted-foreground">@{platform.identifier}</p>
            </div>
          </div>
          {platform.is_verified && (
            <CheckCircle className="h-4 w-4 text-blue-500" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold">{formatNumber(platform.follower_count)}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-xl font-bold">{formatPercentage(platform.engagement_rate)}</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>
        
        {platform.average_views && (
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-muted/50 rounded">
              <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-semibold">{formatNumber(platform.average_views)}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <Heart className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-semibold">{formatNumber(platform.average_likes)}</div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <MessageCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-semibold">{formatNumber(platform.average_comments)}</div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
