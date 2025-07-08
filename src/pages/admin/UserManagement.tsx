import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { useAuthUsers } from '@/hooks/admin/useAuthUsers';
import DeleteUserModal from '@/components/admin/DeleteUserModal';
import UserManagementHeader from '@/components/admin/user-management/UserManagementHeader';
import UserSearchCard from '@/components/admin/user-management/UserSearchCard';
import UserLoadingState from '@/components/admin/user-management/UserLoadingState';
import UserTable from '@/components/admin/user-management/UserTable';
import UserPagination from '@/components/admin/user-management/UserPagination';
import { RefreshCw, AlertCircle } from 'lucide-react';

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

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { user, role } = useUnifiedAuth();
  const perPage = 50;
  const { data: authUsersData, isLoading, error, refetch } = useAuthUsers(currentPage, perPage);

  console.log('👤 UserManagement render state:', {
    currentUser: user?.id,
    currentRole: role,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
    hasData: !!authUsersData,
    dataUsersCount: authUsersData?.users?.length || 0,
    totalUsers: authUsersData?.total || 0,
    currentPage,
    searchTerm
  });

  const users = authUsersData?.users || [];
  const totalUsers = authUsersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / perPage);

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower) ||
      user.user_metadata?.first_name?.toLowerCase().includes(searchLower) ||
      user.user_metadata?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteUser = (user: AuthUser) => {
    setSelectedUserId(user.id);
    setSelectedUserEmail(user.email);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserEmail(undefined);
  };

  const handleRefresh = () => {
    console.log('🔄 Manually refreshing user data...');
    refetch();
  };

  // Show access denied for non-admin users
  if (role !== 'admin' && role !== 'super_admin') {
    return (
      <div className="container mx-auto p-6 bg-background">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          <p className="text-sm text-muted-foreground mt-2">Current role: {role || 'None'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-background">
      <UserManagementHeader totalUsers={totalUsers} />
      
      <UserSearchCard 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Debug info for admin users */}
      {role === 'super_admin' && (
        <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>User ID: {user?.id}</p>
          <p>Role: {role}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? error.message : 'None'}</p>
          <p>Users loaded: {users.length}</p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading && <UserLoadingState />}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-semibold text-destructive">Error Loading Users</h3>
          </div>
          <p className="text-destructive mb-4">{error.message}</p>
          <div className="text-sm text-muted-foreground space-y-1 mb-4">
            <p><strong>Current User ID:</strong> {user?.id}</p>
            <p><strong>Current Role:</strong> {role}</p>
            <p><strong>Error Type:</strong> {error.constructor?.name}</p>
          </div>
          <div className="space-x-2">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <UserTable
            users={users}
            filteredUsers={filteredUsers}
            onDeleteUser={handleDeleteUser}
          />

          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalUsers={totalUsers}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <DeleteUserModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
      />
    </div>
  );
};

export default UserManagement;
