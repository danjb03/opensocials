
import { useState } from 'react';
import { useUserRequests } from '@/hooks/useUserRequests';
import { UserRequestsFilter } from '@/components/admin/UserRequestsFilter';
import { UserRequestsTable } from '@/components/admin/UserRequestsTable';
import { Tabs, TabsContent } from '@/components/ui/tabs';

const UserManagement = () => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'declined'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const { userRequests, handleUserApproval } = useUserRequests(filter);

  const filteredRequests = userRequests.filter(request => {
    const fullName = `${request.profiles?.first_name || ''} ${request.profiles?.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <UserRequestsFilter
        filter={filter}
        searchTerm={searchTerm}
        onFilterChange={value => setFilter(value as typeof filter)}
        onSearchChange={setSearchTerm}
      />

      <Tabs value={filter} className="mt-6">
        <TabsContent value="pending">
          <UserRequestsTable
            requests={filteredRequests}
            filter={filter}
            onApprove={userId => handleUserApproval(userId, true)}
            onDecline={userId => handleUserApproval(userId, false)}
          />
        </TabsContent>
        <TabsContent value="approved">
          <UserRequestsTable
            requests={filteredRequests}
            filter={filter}
            onApprove={userId => handleUserApproval(userId, true)}
            onDecline={userId => handleUserApproval(userId, false)}
          />
        </TabsContent>
        <TabsContent value="declined">
          <UserRequestsTable
            requests={filteredRequests}
            filter={filter}
            onApprove={userId => handleUserApproval(userId, true)}
            onDecline={userId => handleUserApproval(userId, false)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
