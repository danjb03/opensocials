
import React from 'react';
import { Users } from 'lucide-react';

interface UserManagementHeaderProps {
  totalUsers: number;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ totalUsers }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Users className="h-8 w-8 text-foreground" />
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
      </div>
      <p className="text-muted-foreground">
        Manage all users from Supabase Auth. Total users: {totalUsers}
      </p>
    </div>
  );
};

export default UserManagementHeader;
