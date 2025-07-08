import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatorAnalyticsProfile } from '@/components/creator/analytics/CreatorAnalyticsProfile';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const CreatorAnalyticsPage: React.FC = () => {
  const { user } = useUnifiedAuth();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <CreatorAnalyticsProfile />
          ) : (
            <p className="text-muted-foreground">
              Please sign in to view your analytics.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorAnalyticsPage;
