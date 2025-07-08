
import React, { useState } from 'react';
import { useProjectInvitations } from '@/hooks/queries/useProjectInvitations';
import { ProjectInvitationCard } from './ProjectInvitationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MailPlus, CheckCircle, Briefcase, Clock } from 'lucide-react';

export const InvitationsList: React.FC = () => {
  const { 
    data: projectInvitations = [], 
    isLoading: projectLoading,
    error: projectError 
  } = useProjectInvitations();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'declined' | 'all'>('pending');

  const pendingInvitations = projectInvitations.filter(inv => inv.status === 'invited');
  const acceptedInvitations = projectInvitations.filter(inv => inv.status === 'accepted');
  const declinedInvitations = projectInvitations.filter(inv => inv.status === 'declined');

  const EmptyState = ({ message, icon: Icon }: { message: string; icon: React.ElementType }) => (
    <Card className="border-border bg-card/30 backdrop-blur">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted/20 p-4 mb-6">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-3 text-foreground">No invitations found</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </CardContent>
    </Card>
  );

  if (projectLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse border-border bg-card/30">
            <CardContent className="p-8">
              <div className="h-32 bg-muted/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projectError) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="p-8 text-center">
          <h3 className="font-medium text-red-400 mb-3 text-lg">Error Loading Invitations</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/20 p-1">
          <TabsTrigger value="pending" className="flex items-center gap-2 data-[state=active]:bg-card">
            <Clock className="h-4 w-4" />
            Pending
            {pendingInvitations.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingInvitations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center gap-2 data-[state=active]:bg-card">
            <CheckCircle className="h-4 w-4" />
            Accepted
            {acceptedInvitations.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {acceptedInvitations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="declined" className="flex items-center gap-2 data-[state=active]:bg-card">
            <MailPlus className="h-4 w-4" />
            Declined
            {declinedInvitations.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {declinedInvitations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-card">
            <Briefcase className="h-4 w-4" />
            All
            {projectInvitations.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {projectInvitations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingInvitations.length > 0 ? (
            pendingInvitations.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="No pending invitations at the moment. New opportunities will appear here when brands invite you to campaigns."
              icon={Clock}
            />
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-6">
          {acceptedInvitations.length > 0 ? (
            acceptedInvitations.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="You haven't accepted any invitations yet. Accepted campaigns will be shown here."
              icon={CheckCircle}
            />
          )}
        </TabsContent>

        <TabsContent value="declined" className="space-y-6">
          {declinedInvitations.length > 0 ? (
            declinedInvitations.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="No declined invitations. Campaigns you've declined will appear here."
              icon={MailPlus}
            />
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {projectInvitations.length > 0 ? (
            projectInvitations.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="No campaign invitations yet. When brands discover your profile and want to collaborate, their invitations will appear here."
              icon={Briefcase}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
