
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  MapPin,
  Users,
  Target,
  FileText
} from 'lucide-react';
import { ProjectInvitation } from '@/hooks/queries/useProjectInvitations';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectInvitationCardProps {
  invitation: ProjectInvitation;
}

export const ProjectInvitationCard: React.FC<ProjectInvitationCardProps> = ({ invitation }) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleAcceptInvitation = async () => {
    setActionLoading('accept');
    
    try {
      const { error } = await supabase
        .from('project_creators')
        .update({ 
          status: 'accepted',
          response_date: new Date().toISOString()
        })
        .eq('id', invitation.id);

      if (error) throw error;

      toast.success('Invitation accepted successfully!');
      queryClient.invalidateQueries({ queryKey: ['project-invitations'] });
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineInvitation = async () => {
    setActionLoading('decline');
    
    try {
      const { error } = await supabase
        .from('project_creators')
        .update({ 
          status: 'declined',
          response_date: new Date().toISOString()
        })
        .eq('id', invitation.id);

      if (error) throw error;

      toast.success('Invitation declined');
      queryClient.invalidateQueries({ queryKey: ['project-invitations'] });
    } catch (error: any) {
      console.error('Error declining invitation:', error);
      toast.error('Failed to decline invitation. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'invited': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'accepted': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'declined': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'invited': return <Clock className="h-3 w-3" />;
      case 'accepted': return <CheckCircle className="h-3 w-3" />;
      case 'declined': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="border-border bg-card/30 backdrop-blur hover:bg-card/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-muted/20 text-foreground font-medium">
                {invitation.brand_name?.slice(0, 2).toUpperCase() || 'BR'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-medium text-foreground mb-1">
                {invitation.project_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                by {invitation.brand_name}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(invitation.status)} font-light px-3 py-1.5`}>
            <div className="flex items-center gap-1.5">
              {getStatusIcon(invitation.status)}
              {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Campaign Details */}
        <div className="grid grid-cols-2 gap-4">
          {invitation.agreed_amount && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                ${invitation.agreed_amount.toLocaleString()} {invitation.currency}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(invitation.invitation_date), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Content Requirements */}
        {invitation.content_requirements && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Content Requirements
            </h4>
            <div className="text-sm text-muted-foreground bg-muted/10 p-3 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans">
                {typeof invitation.content_requirements === 'string' 
                  ? invitation.content_requirements 
                  : JSON.stringify(invitation.content_requirements, null, 2)
                }
              </pre>
            </div>
          </div>
        )}

        {/* Notes */}
        {invitation.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Notes
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/10 p-3 rounded-lg">
              {invitation.notes}
            </p>
          </div>
        )}

        {/* Action Buttons - Only show for pending invitations */}
        {invitation.status === 'invited' && (
          <>
            <Separator />
            <div className="flex gap-3">
              <Button
                onClick={handleAcceptInvitation}
                disabled={actionLoading === 'accept'}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading === 'accept' ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Accepting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Accept Invitation
                  </div>
                )}
              </Button>
              
              <Button
                onClick={handleDeclineInvitation}
                disabled={actionLoading === 'decline'}
                variant="outline"
                className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/5"
              >
                {actionLoading === 'decline' ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full" />
                    Declining...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Decline
                  </div>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Response Date for completed invitations */}
        {invitation.response_date && invitation.status !== 'invited' && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Responded {formatDistanceToNow(new Date(invitation.response_date), { addSuffix: true })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
