import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatorDealsSecure } from '@/components/creator/deals/CreatorDealsSecure';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const CreatorDeals = () => {
  const { user } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>
            Your Brand Deals
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your brand deals and track your progress.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active <Badge variant="secondary">3</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4">
              <CreatorDealsSecure status="active" />
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              <CreatorDealsSecure status="completed" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorDeals;
