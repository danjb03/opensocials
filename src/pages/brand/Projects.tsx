import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const BrandProjectsPage: React.FC = () => {
  const { user } = useUnifiedAuth();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the Brand Projects page!</p>
          {user && <p>User ID: {user.id}</p>}
          <Button>Create New Project</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandProjectsPage;
