
import React, { useState } from 'react';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvitationsList } from '@/components/creator/invitations/InvitationsList';
import { PendingDeals } from '@/components/deals/PendingDeals';
import { PastDeals } from '@/components/deals/PastDeals';
import { MailPlus, Handshake, History } from 'lucide-react';

const CreatorDeals = () => {
  const [activeTab, setActiveTab] = useState<'invitations' | 'pending' | 'past'>('invitations');

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Deals & Invitations</h1>
          <p className="text-muted-foreground">
            Manage your campaign invitations and track your collaboration deals.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <MailPlus className="h-4 w-4" />
              Invitations
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Active Deals
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Past Deals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invitations">
            <InvitationsList />
          </TabsContent>

          <TabsContent value="pending">
            <PendingDeals />
          </TabsContent>

          <TabsContent value="past">
            <PastDeals />
          </TabsContent>
        </Tabs>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDeals;
