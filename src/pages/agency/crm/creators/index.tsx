
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AgencyCreator {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  primary_platform: string;
  follower_count: number;
  engagement_rate: number;
  status: string;
  active_deals: number;
}

const AgencyCreatorCRM = () => {
  const { data: creators = [], isLoading, error } = useQuery({
    queryKey: ['agency-creators'],
    queryFn: async (): Promise<AgencyCreator[]> => {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          primary_platform,
          follower_count,
          engagement_rate,
          profiles!inner(email, status)
        `);

      if (error) throw error;

      // Get deal counts for each creator
      const creatorsWithDeals = await Promise.all(
        (data || []).map(async (creator) => {
          const { data: deals } = await supabase
            .from('creator_deals')
            .select('status')
            .eq('creator_id', creator.user_id);

          const activeDeals = deals?.filter(deal => deal.status === 'active' || deal.status === 'accepted').length || 0;

          return {
            user_id: creator.user_id,
            first_name: creator.first_name || '',
            last_name: creator.last_name || '',
            email: creator.profiles?.email || 'No email',
            primary_platform: creator.primary_platform || 'Not specified',
            follower_count: creator.follower_count || 0,
            engagement_rate: creator.engagement_rate || 0,
            status: creator.profiles?.status || 'active',
            active_deals: activeDeals,
          };
        })
      );

      return creatorsWithDeals;
    },
  });

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
      accessorKey: 'active_deals',
      header: 'Active Deals',
      cell: ({ row }) => {
        const activeDeals = row.getValue('active_deals') as number;
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

  const activeCreators = creators.filter(c => c.status === 'active').length;
  const totalReach = creators.reduce((total, creator) => total + (creator.follower_count || 0), 0);
  const totalDeals = creators.reduce((sum, creator) => sum + creator.active_deals, 0);

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
            <div className="text-2xl font-bold">{activeCreators}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
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
