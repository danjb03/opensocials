import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useInsightIQData } from '@/hooks/useInsightIQData';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { ProfileHeader } from './ProfileHeader';
import { PlatformCard } from './PlatformCard';
import { AudienceDemographics } from './AudienceDemographics';
import { GeographicDistribution } from './GeographicDistribution';
import { BrandAffinity } from './BrandAffinity';
import { TopInterests } from './TopInterests';
import { PerformanceOverview } from './PerformanceOverview';

export const CreatorAnalyticsProfile: React.FC = () => {
  const { user } = useUnifiedAuth();
  const { data: analyticsData, isLoading, error } = useInsightIQData(user?.id || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData || analyticsData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No analytics data available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Connect your social profiles to display comprehensive analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get primary platform (first one with most followers)
  const primaryPlatform = analyticsData.reduce((prev, current) => 
    (current.follower_count || 0) > (prev.follower_count || 0) ? current : prev
  );

  // Calculate total metrics across all platforms
  const totalFollowers = analyticsData.reduce((sum, data) => sum + (data.follower_count || 0), 0);
  const avgEngagement = analyticsData.reduce((sum, data) => sum + (data.engagement_rate || 0), 0) / analyticsData.length;
  const totalContent = analyticsData.reduce((sum, data) => sum + (data.content_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader 
        primaryPlatform={primaryPlatform}
        totalFollowers={totalFollowers}
        avgEngagement={avgEngagement}
        totalContent={totalContent}
        platformCount={analyticsData.length}
      />

      {/* Platform Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsData.map((platform, index) => (
          <PlatformCard key={index} platform={platform} index={index} />
        ))}
      </div>

      {/* Audience Demographics */}
      <AudienceDemographics audience={primaryPlatform.audience} />

      {/* Geographic Distribution */}
      <GeographicDistribution 
        geographicDistribution={primaryPlatform.audience?.geographic_distribution} 
      />

      {/* Brand Affinity */}
      <BrandAffinity brandAffinity={primaryPlatform.brand_affinity} />

      {/* Top Interests */}
      <TopInterests topInterests={primaryPlatform.top_interests} />

      {/* Performance Metrics */}
      <PerformanceOverview primaryPlatform={primaryPlatform} />
    </div>
  );
};
