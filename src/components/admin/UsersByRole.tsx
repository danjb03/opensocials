
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
}

interface UsersByRoleProps {
  role: 'agency' | 'brand' | 'creator';
}

const UsersByRole = ({ role }: UsersByRoleProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users-by-role', role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as User[];
    },
  });

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return !searchTerm || 
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.company_name?.toLowerCase().includes(searchLower);
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'agency': return 'Agency';
      case 'brand': return 'Brand';
      case 'creator': return 'Creator';
      default: return role;
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === 'brand' && user.company_name) {
          return user.company_name;
        }
        if (user.first_name && user.last_name) {
          return `${user.first_name} ${user.last_name}`;
        }
        return 'No name set';
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.original.status)}>
          {row.original.status || 'Unknown'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        row.original.created_at ? 
          new Date(row.original.created_at).toLocaleDateString() : 
          'Unknown'
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="outline" size="sm">
          View Details
        </Button>
      ),
    },
  ];

  const roleTitle = getRoleDisplayName(role);
  const rolePlural = role === 'agency' ? 'Agencies' : `${roleTitle}s`;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/super-admin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">{rolePlural}</h1>
          <p className="text-muted-foreground">Manage all {role} accounts in the system.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter {rolePlural}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${role}s by name or email...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-destructive text-center py-6">
          <p>Failed to load {role}s. Please try again later.</p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
      />

      {!isLoading && !error && filteredUsers.length === 0 && searchTerm && (
        <div className="text-center py-8 text-muted-foreground">
          No {role}s found matching your search criteria.
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No {role}s found in the system.
        </div>
      )}
    </div>
  );
};

export default UsersByRole;
