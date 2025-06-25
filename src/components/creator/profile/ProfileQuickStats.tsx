
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreatorProfile {
  platforms?: string[];
  industries?: string[];
  is_profile_complete?: boolean;
}

interface ProfileQuickStatsProps {
  creatorProfile: CreatorProfile | null;
}

const ProfileQuickStats: React.FC<ProfileQuickStatsProps> = ({ creatorProfile }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {creatorProfile?.platforms?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Connected Platforms</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {creatorProfile?.industries?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Industries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complete</span>
              <span>{creatorProfile?.is_profile_complete ? '100%' : '60%'}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: creatorProfile?.is_profile_complete ? '100%' : '60%' }}
              />
            </div>
            {!creatorProfile?.is_profile_complete && (
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile setup to maximize visibility
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileQuickStats;
