
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';
import { UserRequestsTable } from '@/components/admin/UserRequestsTable';
import { UserRequestsFilter } from '@/components/admin/UserRequestsFilter';
import { useUserRequests } from '@/hooks/useUserRequests';

const UserManagement = () => {
  const { role } = useAuth();
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const { userRequests, handleUserApproval } = useUserRequests(filter);

  if (role !== 'admin') {
    toast.error('Access Denied', {
      description: 'Only admins can access this page.'
    });
    return null;
  }

  const filteredRequests = userRequests.filter(request => 
    (!searchTerm || 
      request.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <UserRequestsFilter
        filter={filter}
        searchTerm={searchTerm}
        onFilterChange={setFilter}
        onSearchChange={setSearchTerm}
      />

      <TabsContent value={filter}>
        <UserRequestsTable
          requests={filteredRequests}
          filter={filter}
          onApprove={(userId) => handleUserApproval(userId, true)}
          onDecline={(userId) => handleUserApproval(userId, false)}
        />
      </TabsContent>
    </div>
  );
};

export default UserManagement;
