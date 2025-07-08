import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatorDashboardContent } from '@/components/creator/dashboard/CreatorDashboardContent';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const CreatorDashboard = () => {
  const { user, role } = useUnifiedAuth();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome, {user?.email}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreatorDashboardContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorDashboard;
