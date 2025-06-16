
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AgencyBrand {
  user_id: string;
  company_name: string;
  email: string;
  industry: string;
  budget_range: string;
  status: string;
  active_deals: number;
}

const AgencyBrandCRM = () => {
  const { data: brands = [], isLoading, error } = useQuery({
    queryKey: ['agency-brands'],
    queryFn: async (): Promise<AgencyBrand[]> => {
      const { data, error } = await supabase
        .from('brand_profiles')
        .select(`
          user_id,
          company_name,
          industry,
          budget_range,
          profiles!brand_profiles_user_id_fkey(email, status)
        `);

      if (error) throw error;

      // Get deal counts for each brand
      const brandsWithDeals = await Promise.all(
        (data || []).map(async (brand) => {
          const { data: deals } = await supabase
            .from('deals')
            .select('status')
            .eq('brand_id', brand.user_id);

          const activeDeals = deals?.filter(deal => deal.status === 'active' || deal.status === 'accepted').length || 0;

          return {
            user_id: brand.user_id,
            company_name: brand.company_name || 'Unknown Company',
            email: brand.profiles?.email || 'No email',
            industry: brand.industry || 'Not specified',
            budget_range: brand.budget_range || 'Not specified',
            status: brand.profiles?.status || 'active',
            active_deals: activeDeals,
          };
        })
      );

      return brandsWithDeals;
    },
  });

  const columns: ColumnDef<AgencyBrand>[] = [
    {
      accessorKey: 'company_name',
      header: 'Company Name',
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <Link 
            to={`/agency/crm/brands/${brand.user_id}`}
            className="font-medium hover:underline text-blue-600"
          >
            {brand.company_name}
          </Link>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
    },
    {
      accessorKey: 'budget_range',
      header: 'Budget Range',
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
        const brand = row.original;
        return (
          <Button asChild variant="outline" size="sm">
            <Link to={`/agency/crm/brands/${brand.user_id}`}>
              View Details
            </Link>
          </Button>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-red-500">Error loading brands</div>
      </div>
    );
  }

  const activeBrands = brands.filter(b => b.status === 'active').length;
  const totalDeals = brands.reduce((sum, brand) => sum + brand.active_deals, 0);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Brand CRM</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.length}</div>
            <p className="text-xs text-muted-foreground">Under management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBrands}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">Active deals</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={brands} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyBrandCRM;
