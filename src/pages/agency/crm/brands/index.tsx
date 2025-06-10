
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { useAgencyBrands } from '@/hooks/agency/useAgencyBrands';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AgencyBrand } from '@/hooks/agency/useAgencyBrands';

const AgencyBrandCRM = () => {
  const { data: brands = [], isLoading, error } = useAgencyBrands();

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
      cell: ({ row }) => row.getValue('industry') || 'Not specified',
    },
    {
      accessorKey: 'budget_range',
      header: 'Budget Range',
      cell: ({ row }) => row.getValue('budget_range') || 'Not specified',
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
        const activeDeals = Math.floor(Math.random() * 5);
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
            <div className="text-2xl font-bold">
              {brands.filter(b => b.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">All time</p>
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
