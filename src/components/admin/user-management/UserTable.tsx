
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserTableRow from './UserTableRow';

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

interface UserTableProps {
  users: AuthUser[];
  filteredUsers: AuthUser[];
  onDeleteUser: (user: AuthUser) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, filteredUsers, onDeleteUser }) => {
  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Email</TableHead>
            <TableHead className="text-foreground">User ID</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Created</TableHead>
            <TableHead className="text-foreground">Last Sign In</TableHead>
            <TableHead className="text-right text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow className="border-border">
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                {users.length === 0 
                  ? "No users found in Supabase Auth."
                  : "No users found matching your search criteria."
                }
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onDeleteUser={onDeleteUser}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
