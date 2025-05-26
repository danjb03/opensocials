
import React, { useState } from 'react';
import { useCreatorInvitations } from '@/hooks/useCreatorInvitations';
import { InvitationCard } from './InvitationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MailPlus, CheckCircle, XCircle } from 'lucide-react';

export const InvitationsList: React.FC = () => {
  const { 
    invitations, 
    isLoading, 
    actionLoading, 
    acceptInvitation, 
    declineInvitation 
  } = useCreatorInvitations();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'declined'>('pending');

  const pendingInvitations = invitations.filter(inv => inv.status === 'invited');
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted');
  const declinedInvitations = invitations.filter(inv => inv.status === 'declined');

  const EmptyState = ({ message, icon: Icon }: { message: string; icon: React.ElementType }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-3">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-base mb-1">No invitations found</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <MailPlus className="h-4 w-4" />
            Pending ({pendingInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Accepted ({acceptedInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="declined" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Declined ({declinedInvitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingInvitations.length > 0 ? (
            pendingInvitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={acceptInvitation}
                onDecline={declineInvitation}
                isLoading={actionLoading[invitation.id]}
              />
            ))
          ) : (
            <EmptyState 
              message="You don't have any pending campaign invitations."
              icon={MailPlus}
            />
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedInvitations.length > 0 ? (
            acceptedInvitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={acceptInvitation}
                onDecline={declineInvitation}
              />
            ))
          ) : (
            <EmptyState 
              message="You haven't accepted any campaign invitations yet."
              icon={CheckCircle}
            />
          )}
        </TabsContent>

        <TabsContent value="declined" className="space-y-4">
          {declinedInvitations.length > 0 ? (
            declinedInvitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={acceptInvitation}
                onDecline={declineInvitation}
              />
            ))
          ) : (
            <EmptyState 
              message="You haven't declined any campaign invitations."
              icon={XCircle}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
