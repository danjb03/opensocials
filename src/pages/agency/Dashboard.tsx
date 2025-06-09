
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { useAgencyUsers } from '@/hooks/agency/useAgencyUsers';
import { useAgencyBrands } from '@/hooks/agency/useAgencyBrands';
import { useAgencyCreators } from '@/hooks/agency/useAgencyCreators';

const AgencyDashboard = () => {
  const { data: agencyUsers = [], isLoading: usersLoading } = useAgencyUsers();
  const { data: brands = [], isLoading: brandsLoading } = useAgencyBrands();
  const { data: creators = [], isLoading: creatorsLoading } = useAgencyCreators();

  const isLoading = usersLoading || brandsLoading || creatorsLoading;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Agency Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : creators.length}
            </div>
            <p className="text-xs text-muted-foreground">Creators under management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Brands</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : brands.length}
            </div>
            <p className="text-xs text-muted-foreground">Brands under management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Managed Users</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : agencyUsers.length}
            </div>
            <p className="text-xs text-muted-foreground">All managed accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agency Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Overall status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading activity...</p>
              </div>
            ) : agencyUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No managed users yet</p>
                <p className="text-sm">Contact an administrator to get users assigned to your agency</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agencyUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {user.profiles?.first_name} {user.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.profiles?.role} • Added {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agency Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Access</span>
                <span className="text-sm text-green-600">✅ Secured</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Scope</span>
                <span className="text-sm text-blue-600">Agency Only</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Permissions</span>
                <span className="text-sm text-purple-600">Managed Users</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                You can only see and manage users that have been specifically assigned to your agency.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyDashboard;
