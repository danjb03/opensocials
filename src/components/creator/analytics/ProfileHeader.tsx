
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';
import { PLATFORM_CONFIG, formatNumber, formatPercentage } from './utils';

interface ProfileHeaderProps {
  primaryPlatform: any;
  totalFollowers: number;
  avgEngagement: number;
  totalContent: number;
  platformCount: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  primaryPlatform,
  totalFollowers,
  avgEngagement,
  totalContent,
  platformCount,
}) => {
  const config = PLATFORM_CONFIG[primaryPlatform.platform as keyof typeof PLATFORM_CONFIG];

  return (
    <Card className="overflow-hidden">
      <div className={`h-32 ${config?.color || 'bg-gradient-to-r from-blue-500 to-purple-600'}`} />
      <CardContent className="p-6 -mt-16 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={primaryPlatform.image_url || ''} />
            <AvatarFallback className="text-2xl">
              {primaryPlatform.full_name?.split(' ').map((n: string) => n[0]).join('') || 'CR'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">
                {primaryPlatform.full_name || `@${primaryPlatform.identifier}`}
              </h1>
              {primaryPlatform.is_verified && (
                <CheckCircle className="h-6 w-6 text-blue-500" />
              )}
            </div>
            
            <p className="text-muted-foreground mb-4 max-w-2xl">
              {primaryPlatform.introduction || 'Creative professional and content creator'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold">{formatNumber(totalFollowers)}</div>
                <div className="text-sm text-muted-foreground">Total Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatPercentage(avgEngagement)}</div>
                <div className="text-sm text-muted-foreground">Avg Engagement</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalContent}</div>
                <div className="text-sm text-muted-foreground">Total Content</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{platformCount}</div>
                <div className="text-sm text-muted-foreground">Platforms</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
