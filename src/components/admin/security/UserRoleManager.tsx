
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Eye, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  profiles?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

export function UserRoleManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: userRoles, isLoading } = useQuery({
    queryKey: ['user-roles', searchTerm],
    queryFn: async (): Promise<UserRole[]> => {
      let query = supabase
        .from('user_roles')
        .select(`
          *,
          profiles:user_id (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        // Note: This is a simplified search, in a real app you'd join with profiles
        query = query.ilike('role', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, status }: { roleId: string; status: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ status })
        .eq('id', roleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role status updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });

  const handleApproveRole = (roleId: string) => {
    updateRoleMutation.mutate({ roleId, status: 'approved' });
  };

  const handleRejectRole = (roleId: string) => {
    updateRoleMutation.mutate({ roleId, status: 'rejected' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case 'brand':
        return <Badge className="bg-orange-100 text-orange-800">Brand</Badge>;
      case 'creator':
        return <Badge className="bg-green-100 text-green-800">Creator</Badge>;
      case 'agency':
        return <Badge className="bg-teal-100 text-teal-800">Agency</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>
            Review and manage user role requests and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading roles...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No user roles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    userRoles?.map((userRole) => (
                      <TableRow key={userRole.id}>
                        <TableCell className="font-medium">
                          {userRole.profiles?.first_name || userRole.profiles?.last_name 
                            ? `${userRole.profiles.first_name || ''} ${userRole.profiles.last_name || ''}`.trim()
                            : 'Unknown User'
                          }
                        </TableCell>
                        <TableCell>{userRole.profiles?.email || 'No email'}</TableCell>
                        <TableCell>{getRoleBadge(userRole.role)}</TableCell>
                        <TableCell>{getStatusBadge(userRole.status)}</TableCell>
                        <TableCell>
                          {new Date(userRole.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {userRole.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveRole(userRole.id)}
                                  disabled={updateRoleMutation.isPending}
                                  className="gap-1"
                                >
                                  <Check className="h-3 w-3" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectRole(userRole.id)}
                                  disabled={updateRoleMutation.isPending}
                                  className="gap-1"
                                >
                                  <X className="h-3 w-3" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" className="gap-1">
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
