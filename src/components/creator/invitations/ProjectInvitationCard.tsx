
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, CheckCircle, XCircle, Clock, DollarSign, FileText } from 'lucide-react';
import { ProjectInvitation } from '@/hooks/queries/useProjectInvitations';
import { useAcceptProjectInvitation } from '@/hooks/mutations/useAcceptProjectInvitation';

interface ProjectInvitationCardProps {
  invitation: ProjectInvitation;
}

export const ProjectInvitationCard: React.FC<ProjectInvitationCardProps> = ({
  invitation,
}) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseNotes, setResponseNotes] = useState('');
  const acceptMutation = useAcceptProjectInvitation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Response
          </Badge>
        );
    }
  };

  const handleResponse = async (action: 'accept' | 'decline') => {
    await acceptMutation.mutateAsync({
      invitationId: invitation.id,
      action,
      notes: responseNotes || undefined,
    });
    setShowResponseForm(false);
    setResponseNotes('');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{invitation.project_name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                from {invitation.brand_name}
              </p>
            </div>
          </div>
          {getStatusBadge(invitation.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {invitation.agreed_amount && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">
              {invitation.currency} {invitation.agreed_amount.toLocaleString()}
            </span>
          </div>
        )}

        {invitation.notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Campaign Notes
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {invitation.notes}
            </p>
          </div>
        )}

        {invitation.content_requirements && Object.keys(invitation.content_requirements).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Content Requirements
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {Object.entries(invitation.content_requirements).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Invited {format(new Date(invitation.invitation_date), 'MMM d, yyyy at h:mm a')}
          {invitation.response_date && (
            <span>
              {' • '} Responded {format(new Date(invitation.response_date), 'MMM d, yyyy at h:mm a')}
            </span>
          )}
        </div>

        {showResponseForm && invitation.status === 'invited' && (
          <div className="space-y-3 pt-3 border-t">
            <Textarea
              placeholder="Add a note to your response (optional)..."
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              className="min-h-20"
            />
          </div>
        )}
      </CardContent>

      {invitation.status === 'invited' && (
        <CardFooter className="pt-3 gap-2">
          {!showResponseForm ? (
            <Button
              onClick={() => setShowResponseForm(true)}
              className="w-full"
              variant="outline"
            >
              Respond to Invitation
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleResponse('decline')}
                variant="outline"
                className="flex-1"
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? 'Processing...' : 'Decline'}
              </Button>
              <Button
                onClick={() => handleResponse('accept')}
                className="flex-1"
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? 'Processing...' : 'Accept'}
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
