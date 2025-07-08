
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Sparkles } from 'lucide-react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { useConnectedAccounts } from '@/hooks/creator/useConnectedAccounts';

const AccountMetricsPanel = () => {
  const { creatorProfile } = useUnifiedAuth();
  const { data: connectedAccounts = [] } = useConnectedAccounts();

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 8; // Total number of profile fields to complete

    if (creatorProfile?.first_name) completed++;
    if (creatorProfile?.last_name) completed++;
    if (creatorProfile?.bio) completed++;
    if (creatorProfile?.avatar_url) completed++;
    if (creatorProfile?.primary_platform) completed++;
    if (creatorProfile?.industries && creatorProfile.industries.length > 0) completed++;
    if (connectedAccounts.length > 0) completed++;
    if (creatorProfile?.content_types && creatorProfile.content_types.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateProfileCompletion();
  const connectedPlatforms = connectedAccounts.length;
  const taggedIndustries = creatorProfile?.industries?.length || 0;

  const getCompletionMessage = () => {
    if (completionPercentage >= 90) return "Outstanding profile! 🎉";
    if (completionPercentage >= 70) return "Great progress! Keep it up";
    if (completionPercentage >= 50) return "You're halfway there!";
    return "Let's build your profile";
  };

  const handleImproveProfile = () => {
    // Scroll to missing sections or open improvement modal
    const missingItems = [];
    if (!creatorProfile?.first_name || !creatorProfile?.last_name) missingItems.push('name');
    if (!creatorProfile?.bio) missingItems.push('bio');
    if (!creatorProfile?.avatar_url) missingItems.push('avatar');
    if (connectedAccounts.length === 0) missingItems.push('social accounts');
    
    console.log('Missing profile items:', missingItems);
    // You could implement a guided tour or modal here
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Account Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connected Platforms */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Connected Platforms</span>
          </div>
          <Badge variant={connectedPlatforms > 0 ? "default" : "secondary"}>
            {connectedPlatforms}
          </Badge>
        </div>

        {/* Tagged Industries */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Tagged Industries</span>
          </div>
          <Badge variant={taggedIndustries > 0 ? "default" : "secondary"}>
            {taggedIndustries}
          </Badge>
        </div>

        {/* Profile Completion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Profile Completion</span>
            <span className="text-sm font-semibold text-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {getCompletionMessage()}
          </p>
        </div>

        <Button 
          onClick={handleImproveProfile}
          className="w-full"
          variant={completionPercentage < 90 ? "default" : "secondary"}
        >
          {completionPercentage < 90 ? "Improve Profile" : "Profile Complete!"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountMetricsPanel;
