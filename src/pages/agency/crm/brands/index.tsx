
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAgencyBrands } from '@/hooks/agency/useAgencyBrands';

interface AgencyBrand {
  user_id: string;
  company_name: string;
  email: string;
  industry: string;
  budget_range: string;
  status: string;
  logo_url: string | null;
  website_url: string | null;
  brand_bio: string | null;
  created_at: string;
}

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
      cell: ({ row }) => {
        return row.getValue('industry') || 'Not specified';
      },
    },
    {
      accessorKey: 'budget_range',
      header: 'Budget Range',
      cell: ({ row }) => {
        return row.getValue('budget_range') || 'Not specified';
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
            <p className="text-xs text-muted-foreground">Under your management</p>
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
            <CardTitle className="text-sm font-medium">Pending Setup</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.filter(b => b.status !== 'active').length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Managed Brands</CardTitle>
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
