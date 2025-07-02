import React, { useState } from 'react';
import { useCreatorInvitations } from '@/hooks/useCreatorInvitations';
import { useProjectInvitations } from '@/hooks/queries/useProjectInvitations';
import { useInvitationSimulation } from '@/hooks/useInvitationSimulation';
import { InvitationCard } from './InvitationCard';
import { ProjectInvitationCard } from './ProjectInvitationCard';
import { MockInvitationCard } from './MockInvitationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MailPlus, CheckCircle, XCircle, Briefcase, Zap } from 'lucide-react';

export const InvitationsList: React.FC = () => {
  const { 
    invitations, 
    isLoading: generalLoading, 
    actionLoading, 
    acceptInvitation, 
    declineInvitation 
  } = useCreatorInvitations();
  
  const { 
    data: projectInvitations = [], 
    isLoading: projectLoading 
  } = useProjectInvitations();

  const {
    invitations: mockInvitations,
    isLoading: mockLoading,
    actionLoading: mockActionLoading,
    acceptInvitation: acceptMockInvitation,
    declineInvitation: declineMockInvitation
  } = useInvitationSimulation();
  
  const [activeTab, setActiveTab] = useState<'active' | 'projects' | 'general' | 'all'>('active');

  // Debug logging
  console.log('Mock invitations:', mockInvitations);
  console.log('Mock loading:', mockLoading);

  const isLoading = generalLoading || projectLoading || mockLoading;

  const pendingMockInvitations = mockInvitations.filter(inv => inv.status === 'invited');
  const acceptedMockInvitations = mockInvitations.filter(inv => inv.status === 'accepted');
  const declinedMockInvitations = mockInvitations.filter(inv => inv.status === 'declined');

  const pendingProjectInvitations = projectInvitations.filter(inv => inv.status === 'invited');
  const pendingGeneralInvitations = invitations.filter(inv => inv.status === 'invited');

  const totalPending = pendingMockInvitations.length + pendingProjectInvitations.length + pendingGeneralInvitations.length;

  const EmptyState = ({ message, icon: Icon }: { message: string; icon: React.ElementType }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted/20 p-3 mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-base mb-2 text-white">No invitations found</h3>
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
              <div className="h-24 bg-muted/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Active Campaigns
            {totalPending > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                {totalPending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Project Invites ({pendingProjectInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <MailPlus className="h-4 w-4" />
            General Invites ({pendingGeneralInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Campaign Invitations - Always show these for testing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Campaign Invitations</h3>
              <Badge className="bg-green-600 hover:bg-green-700">
                {pendingMockInvitations.length} Pending
              </Badge>
            </div>
            {pendingMockInvitations.map((invitation) => (
              <MockInvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={acceptMockInvitation}
                onDecline={declineMockInvitation}
                isLoading={mockActionLoading[invitation.id]}
              />
            ))}
          </div>

          {/* Accepted Campaigns */}
          {acceptedMockInvitations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Ready to Start</h3>
                <Badge variant="outline" className="border-green-600 text-green-600">
                  {acceptedMockInvitations.length} Accepted
                </Badge>
              </div>
              {acceptedMockInvitations.map((invitation) => (
                <MockInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={acceptMockInvitation}
                  onDecline={declineMockInvitation}
                  isLoading={mockActionLoading[invitation.id]}
                />
              ))}
            </div>
          )}

          {pendingMockInvitations.length === 0 && acceptedMockInvitations.length === 0 && (
            <EmptyState 
              message="No active campaign invitations at the moment."
              icon={Zap}
            />
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {pendingProjectInvitations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Pending Project Invitations</h3>
              {pendingProjectInvitations.map((invitation) => (
                <ProjectInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="You don't have any pending project invitations."
              icon={Briefcase}
            />
          )}
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          {pendingGeneralInvitations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Pending General Invitations</h3>
              {pendingGeneralInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={acceptInvitation}
                  onDecline={declineInvitation}
                  isLoading={actionLoading[invitation.id]}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="You don't have any pending general invitations."
              icon={MailPlus}
            />
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {/* All Mock Invitations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <Zap className="h-5 w-5" />
              Campaign Invitations
            </h3>
            {mockInvitations.length > 0 ? (
              <div className="space-y-4">
                {mockInvitations.map((invitation) => (
                  <MockInvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    onAccept={acceptMockInvitation}
                    onDecline={declineMockInvitation}
                    isLoading={mockActionLoading[invitation.id]}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No campaign invitations yet."
                icon={Zap}
              />
            )}
          </div>

          {/* Project Invitations History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <Briefcase className="h-5 w-5" />
              Project Invitations
            </h3>
            {projectInvitations.length > 0 ? (
              <div className="space-y-4">
                {projectInvitations.map((invitation) => (
                  <ProjectInvitationCard
                    key={invitation.id}
                    invitation={invitation}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No project invitations yet."
                icon={Briefcase}
              />
            )}
          </div>

          {/* General Invitations History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <MailPlus className="h-5 w-5" />
              General Invitations
            </h3>
            {invitations.length > 0 ? (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    onAccept={acceptInvitation}
                    onDecline={declineInvitation}
                    isLoading={actionLoading[invitation.id]}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="No general invitations yet."
                icon={MailPlus}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
