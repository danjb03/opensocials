
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Search, Trash2, Users } from 'lucide-react';
import { useAuthUsers } from '@/hooks/admin/useAuthUsers';
import DeleteUserModal from '@/components/admin/DeleteUserModal';

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
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-foreground" />
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage all users from Supabase Auth. Total users: {totalUsers}
        </p>
      </div>

      <Card className="mb-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by email, ID, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background border-border text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin h-6 w-6 text-foreground" />
        </div>
      )}

      {error && (
        <div className="text-destructive-foreground text-center py-6">
          <p>Failed to load users. Please try again later.</p>
          <p className="text-sm mt-2">Error: {error.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
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
                    <TableRow key={user.id} className="border-border">
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
                          onClick={() => handleDeleteUser(user)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({totalUsers} total users)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
