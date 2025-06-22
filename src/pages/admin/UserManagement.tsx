
import { useState } from 'react';
import { useAuthUsers } from '@/hooks/admin/useAuthUsers';
import DeleteUserModal from '@/components/admin/DeleteUserModal';
import UserManagementHeader from '@/components/admin/user-management/UserManagementHeader';
import UserSearchCard from '@/components/admin/user-management/UserSearchCard';
import UserLoadingState from '@/components/admin/user-management/UserLoadingState';
import UserErrorState from '@/components/admin/user-management/UserErrorState';
import UserTable from '@/components/admin/user-management/UserTable';
import UserPagination from '@/components/admin/user-management/UserPagination';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

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
  const { data: authUsersData, isLoading, error } = useAuthUsers(currentPage, perPage);

  console.log('👤 UserManagement render:', {
    currentUser: user?.id,
    currentRole: role,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
    hasData: !!authUsersData
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

      {isLoading && <UserLoadingState />}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Users</h3>
          <p className="text-destructive mb-4">{error.message}</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Current User ID:</strong> {user?.id}</p>
            <p><strong>Current Role:</strong> {role}</p>
            <p><strong>Error Type:</strong> {error.constructor?.name}</p>
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
