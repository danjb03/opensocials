
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit3, Users } from 'lucide-react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { useConnectedAccounts } from '@/hooks/creator/useConnectedAccounts';
import EditProfileModal from './EditProfileModal';

const ProfileOverviewPanel = () => {
  const { user, creatorProfile } = useUnifiedAuth();
  const { data: connectedAccounts = [] } = useConnectedAccounts();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Calculate total followers across all platforms
  const totalFollowers = connectedAccounts.reduce((total, account) => {
    // This would come from the social metrics data
    return total + (account.followers || 0);
  }, 0);

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const displayName = creatorProfile?.first_name && creatorProfile?.last_name 
    ? `${creatorProfile.first_name} ${creatorProfile.last_name}`
    : creatorProfile?.username || user?.email?.split('@')[0];

  const primaryPlatform = creatorProfile?.primary_platform || 
    (connectedAccounts.length > 0 ? connectedAccounts[0].platform : null);

  return (
    <>
      <Card className="bg-card border-border h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground flex items-center justify-between">
            Profile Overview
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={creatorProfile?.avatar_url || ''} />
              <AvatarFallback className="bg-muted text-foreground text-lg">
                {displayName?.charAt(0)?.toUpperCase() || 'C'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">
                {displayName}
              </h3>
              {creatorProfile?.username && (
                <p className="text-muted-foreground">@{creatorProfile.username}</p>
              )}
              {primaryPlatform && (
                <Badge variant="secondary" className="mt-1 capitalize">
                  {primaryPlatform}
                </Badge>
              )}
            </div>
          </div>

          {creatorProfile?.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {creatorProfile.bio}
            </p>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold text-foreground">
              {formatFollowerCount(totalFollowers)}
            </span>
            <span className="text-sm text-muted-foreground">
              total followers
            </span>
          </div>
        </CardContent>
      </Card>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

export default ProfileOverviewPanel;
