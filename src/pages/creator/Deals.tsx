
import React from 'react';
import { useProjectInvitations } from '@/hooks/queries/useProjectInvitations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectInvitationCard } from '@/components/creator/invitations/ProjectInvitationCard';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const CreatorDeals = () => {
  const { user, role } = useUnifiedAuth();
  const { 
    data: invitations = [], 
    isLoading, 
    error 
  } = useProjectInvitations();

  console.log('CreatorDeals - Invitations data:', invitations);

  // Filter invitations by status to create deal categories
  const activeDeals = invitations.filter(inv => 
    ['accepted', 'contracted', 'in_progress'].includes(inv.status)
  );
  const pendingDeals = invitations.filter(inv => inv.status === 'invited');
  const completedDeals = invitations.filter(inv => 
    ['completed', 'submitted'].includes(inv.status)
  );
  const rejectedDeals = invitations.filter(inv => inv.status === 'declined');

  const EmptyState = ({ message, icon: Icon }: { message: string; icon: React.ElementType }) => (
    <Card className="border-border bg-card/30 backdrop-blur">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted/20 p-3 mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-base mb-2 text-foreground">No deals found</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-background min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
            My Deals
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Track your brand partnerships and collaborations.
          </p>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse border-border bg-card/30">
              <CardContent className="p-6">
                <div className="h-24 bg-muted/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 bg-background min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
            My Deals
          </h1>
        </div>
        
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-red-400 mb-2">Error Loading Deals</h3>
            <p className="text-sm text-muted-foreground">
              {error.message || 'Please try refreshing the page'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Super admin preview mode
  if (role === 'super_admin') {
    return (
      <div className="container mx-auto p-6 bg-background min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
            My Deals
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            You are viewing the creator deals page as a super admin.
          </p>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/20">
            <TabsTrigger value="active">Active (0)</TabsTrigger>
            <TabsTrigger value="pending">Pending (0)</TabsTrigger>
            <TabsTrigger value="completed">Completed (0)</TabsTrigger>
            <TabsTrigger value="rejected">Rejected (0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <EmptyState 
              message="No active deals available in preview mode"
              icon={DollarSign}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <EmptyState 
              message="No pending deals available in preview mode"
              icon={Clock}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <EmptyState 
              message="No completed deals available in preview mode"
              icon={CheckCircle}
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <EmptyState 
              message="No rejected deals available in preview mode"
              icon={XCircle}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
          My Deals
        </h1>
        <p className="text-lg text-muted-foreground font-light">
          Track your brand partnerships and collaborations.
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/20">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Active
            {activeDeals.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeDeals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
            {pendingDeals.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingDeals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed
            {completedDeals.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {completedDeals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected
            {rejectedDeals.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {rejectedDeals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDeals.length > 0 ? (
            activeDeals.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="No active deals at the moment. Accepted invitations will appear here."
              icon={DollarSign}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingDeals.length > 0 ? (
            pendingDeals.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="No pending deals. New brand invitations will appear here."
              icon={Clock}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedDeals.length > 0 ? (
            completedDeals.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="No completed deals yet. Finished collaborations will be shown here."
              icon={CheckCircle}
            />
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedDeals.length > 0 ? (
            rejectedDeals.map((invitation) => (
              <ProjectInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <EmptyState 
              message="No rejected deals. Declined invitations will appear here."
              icon={XCircle}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDeals;
