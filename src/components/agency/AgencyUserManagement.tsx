
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail } from 'lucide-react';
import { useAgencyUsers } from '@/hooks/agency/useAgencyUsers';

const AgencyUserManagement = () => {
  const { data: agencyUsers = [], isLoading, error } = useAgencyUsers();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="text-center py-8">Loading your managed users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="text-center py-8 text-red-500">Error loading users</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Managed Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agencyUsers.length}</div>
            <p className="text-xs text-muted-foreground">Users under your management</p>
          </CardContent>
        </Card>
      </div>

      {agencyUsers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users managed yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't been assigned any users to manage yet.
            </p>
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Contact Administrator
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Managed Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agencyUsers.map((agencyUser) => (
                <div key={agencyUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {agencyUser.profiles?.first_name} {agencyUser.profiles?.last_name}
                      </h3>
                      <Badge variant="outline">
                        {agencyUser.profiles?.role || agencyUser.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {agencyUser.profiles?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added: {new Date(agencyUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={agencyUser.profiles?.status === 'active' ? 'default' : 'secondary'}>
                      {agencyUser.profiles?.status || 'unknown'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgencyUserManagement;
