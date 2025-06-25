
import React, { useState } from 'react';
import { useCreatorInvitations } from '@/hooks/useCreatorInvitations';
import { useProjectInvitations } from '@/hooks/queries/useProjectInvitations';
import { InvitationCard } from './InvitationCard';
import { ProjectInvitationCard } from './ProjectInvitationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MailPlus, CheckCircle, XCircle, Briefcase } from 'lucide-react';

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
  
  const [activeTab, setActiveTab] = useState<'projects' | 'general' | 'all'>('projects');

  const isLoading = generalLoading || projectLoading;

  const pendingProjectInvitations = projectInvitations.filter(inv => inv.status === 'invited');
  const acceptedProjectInvitations = projectInvitations.filter(inv => inv.status === 'accepted');
  const declinedProjectInvitations = projectInvitations.filter(inv => inv.status === 'declined');

  const pendingGeneralInvitations = invitations.filter(inv => inv.status === 'invited');
  const acceptedGeneralInvitations = invitations.filter(inv => inv.status === 'accepted');
  const declinedGeneralInvitations = invitations.filter(inv => inv.status === 'declined');

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
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Campaign Invites ({pendingProjectInvitations.length})
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

        <TabsContent value="projects" className="space-y-4">
          {pendingProjectInvitations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pending Campaign Invitations</h3>
              {pendingProjectInvitations.map((invitation) => (
                <ProjectInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="You don't have any pending campaign invitations."
              icon={Briefcase}
            />
          )}
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          {pendingGeneralInvitations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pending General Invitations</h3>
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
          {/* Project Invitations History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Campaign Invitations
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
                message="No campaign invitations yet."
                icon={Briefcase}
              />
            )}
          </div>

          {/* General Invitations History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
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
