
import { useState } from 'react';
import { useAuthUsers } from '@/hooks/admin/useAuthUsers';
import DeleteUserModal from '@/components/admin/DeleteUserModal';
import UserManagementHeader from '@/components/admin/user-management/UserManagementHeader';
import UserSearchCard from '@/components/admin/user-management/UserSearchCard';
import UserLoadingState from '@/components/admin/user-management/UserLoadingState';
import UserErrorState from '@/components/admin/user-management/UserErrorState';
import UserTable from '@/components/admin/user-management/UserTable';
import UserPagination from '@/components/admin/user-management/UserPagination';

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

  const perPage = 50;
  const { data: authUsersData, isLoading, error } = useAuthUsers(currentPage, perPage);

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

  return (
    <div className="container mx-auto p-6 bg-background">
      <UserManagementHeader totalUsers={totalUsers} />
      
      <UserSearchCard 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isLoading && <UserLoadingState />}

      {error && <UserErrorState error={error} />}

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
