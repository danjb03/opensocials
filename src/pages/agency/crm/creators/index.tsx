
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useAgencyCreators } from '@/hooks/agency/useAgencyCreators';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AgencyCreator } from '@/hooks/agency/useAgencyCreators';

const AgencyCreatorCRM = () => {
  const { data: creators = [], isLoading, error } = useAgencyCreators();

  const columns: ColumnDef<AgencyCreator>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const creator = row.original;
        return (
          <Link 
            to={`/agency/crm/creators/${creator.user_id}`}
            className="font-medium hover:underline text-blue-600"
          >
            {creator.first_name} {creator.last_name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'primary_platform',
      header: 'Platform',
      cell: ({ row }) => row.getValue('primary_platform') || 'Not specified',
    },
    {
      accessorKey: 'follower_count',
      header: 'Followers',
      cell: ({ row }) => {
        const count = row.getValue('follower_count') as number;
        return count ? count.toLocaleString() : 'N/A';
      },
    },
    {
      accessorKey: 'engagement_rate',
      header: 'Engagement',
      cell: ({ row }) => {
        const rate = row.getValue('engagement_rate') as number;
        return rate ? `${rate}%` : 'N/A';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'deals',
      header: 'Active Deals',
      cell: () => {
        // Mock data - in real app this would come from deals query
        const activeDeals = Math.floor(Math.random() * 3);
        return <span className="font-medium">{activeDeals}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const creator = row.original;
        return (
          <Button asChild variant="outline" size="sm">
            <Link to={`/agency/crm/creators/${creator.user_id}`}>
              View Profile
            </Link>
          </Button>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-red-500">Error loading creators</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Creator CRM</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creators.length}</div>
            <p className="text-xs text-muted-foreground">Under management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {creators.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {creators.reduce((total, creator) => total + (creator.follower_count || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Combined followers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Creators</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={creators} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyCreatorCRM;
