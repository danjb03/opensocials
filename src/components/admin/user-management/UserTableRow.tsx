
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  phone?: string;
  role?: string;
  user_metadata?: Record<string, any>;
}

interface UserTableRowProps {
  user: AuthUser;
  onDeleteUser: (user: AuthUser) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user, onDeleteUser }) => {
  const getStatusBadge = (user: AuthUser) => {
    if (user.email_confirmed_at) {
      return <Badge variant="default">Confirmed</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getUserName = (user: AuthUser) => {
    const firstName = user.user_metadata?.first_name;
    const lastName = user.user_metadata?.last_name;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    return 'No name set';
  };

  return (
    <TableRow className="border-border">
      <TableCell className="font-medium text-foreground">
        {getUserName(user)}
      </TableCell>
      <TableCell className="text-foreground">
        {user.email || 'No email'}
      </TableCell>
      <TableCell className="text-foreground font-mono text-sm">
        {user.id}
      </TableCell>
      <TableCell>
        {getStatusBadge(user)}
      </TableCell>
      <TableCell className="text-foreground">
        {formatDate(user.created_at)}
      </TableCell>
      <TableCell className="text-foreground">
        {formatDateTime(user.last_sign_in_at)}
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDeleteUser(user)}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
