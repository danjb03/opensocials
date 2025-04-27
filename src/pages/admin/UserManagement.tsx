
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

type UserRequest = {
  id: string;
  user_id: string;
  role: 'creator' | 'brand' | 'admin';  // Updated to include 'admin'
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
};

const UserManagement = () => {
  const { user, role } = useAuth();
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (role !== 'admin') {
      toast.error('Access Denied', {
        description: 'Only admins can access this page.'
      });
      return;
    }
    fetchUserRequests();
  }, [role, filter]);

  const fetchUserRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles:user_id(first_name, last_name, email)
        `)
        .eq('status', filter);

      if (error) throw error;
      
      // Cast the data to ensure it matches the UserRequest type
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'declined'
      })) as UserRequest[];
      
      setUserRequests(typedData);
    } catch (error) {
      toast.error('Error fetching user requests', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleUserApproval = async (userId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ 
          status: approve ? 'approved' : 'declined' 
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(
        approve ? 'User approved successfully' : 'User request declined'
      );

      fetchUserRequests();
    } catch (error) {
      toast.error('Error processing user request', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const filteredRequests = userRequests.filter(request => 
    (!searchTerm || 
      request.profiles?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.profiles?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (role !== 'admin') return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <div className="mb-4 flex items-center space-x-4">
        <Input 
          placeholder="Search users..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="pending" onValueChange={setFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="approved">Approved Users</TabsTrigger>
          <TabsTrigger value="declined">Declined Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter}>
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
              {filteredRequests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>
                    {request.profiles?.first_name} {request.profiles?.last_name}
                  </TableCell>
                  <TableCell>{request.role}</TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  {filter === 'pending' && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleUserApproval(request.user_id, true)}
                          variant="outline"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleUserApproval(request.user_id, false)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
