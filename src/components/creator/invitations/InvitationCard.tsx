
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { CreatorInvitation } from '@/hooks/useCreatorInvitations';

interface InvitationCardProps {
  invitation: CreatorInvitation;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  isLoading?: boolean;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
  isLoading = false
}) => {
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
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">Campaign Invitation</h3>
              <p className="text-sm text-muted-foreground">
                from {invitation.brand_name || invitation.company_name || 'Brand'}
              </p>
            </div>
          </div>
          {getStatusBadge(invitation.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          You've been invited to participate in a campaign collaboration.
        </p>

        <div className="text-xs text-muted-foreground">
          Invited {format(new Date(invitation.created_at), 'MMM d, yyyy at h:mm a')}
        </div>
      </CardContent>

      {invitation.status === 'invited' && (
        <CardFooter className="pt-3 gap-2">
          <Button
            onClick={() => onDecline(invitation.id)}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Decline'}
          </Button>
          <Button
            onClick={() => onAccept(invitation.id)}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Accept'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
