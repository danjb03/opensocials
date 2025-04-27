
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserRequest } from '@/types/admin';

interface UserRequestsTableProps {
  requests: UserRequest[];
  filter: string;
  onApprove: (userId: string) => void;
  onDecline: (userId: string) => void;
}

export const UserRequestsTable = ({ 
  requests, 
  filter,
  onApprove, 
  onDecline 
}: UserRequestsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Signup Date</TableHead>
          {filter === 'pending' && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map(request => (
          <TableRow key={request.id}>
            <TableCell>
              {request.profiles ? 
                `${request.profiles.first_name || ''} ${request.profiles.last_name || ''}` : 
                'Unknown User'}
            </TableCell>
            <TableCell>{request.role}</TableCell>
            <TableCell>
              {new Date(request.created_at).toLocaleDateString()}
            </TableCell>
            {filter === 'pending' && (
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => onApprove(request.user_id)}
                    variant="outline"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => onDecline(request.user_id)}
                    variant="destructive"
                  >
                    Decline
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
