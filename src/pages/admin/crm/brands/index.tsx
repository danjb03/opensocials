
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import { BrandsTable } from '@/components/admin/crm/BrandsTable';
import { Search } from 'lucide-react';
import { useBrandCRM } from '@/hooks/admin/useBrandCRM';

const BrandsCRM = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  
  // Local state for form inputs
  const [search, setSearch] = useState(searchTerm);
  
  // Use real brand CRM hook
  const { brands, pagination, isLoading, error } = useBrandCRM({
    search: searchTerm,
    status: statusFilter,
    page,
    pageSize
  });
  
  // Update URL parameters when filters change
  const updateFilters = (newParams: Record<string, string>) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };
    
    // Remove empty values
    Object.keys(updated).forEach(key => 
      updated[key] === '' && delete updated[key]
    );
    
    // Reset to page 1 when filters change
    if (newParams.search !== undefined || newParams.status !== undefined) {
      updated.page = '1';
    }
    
    setSearchParams(updated);
  };
  
  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };
  
  // Handle status filter change
  const handleStatusChange = (value: string) => {
    updateFilters({ status: value });
  };
  
  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching brands',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  }, [error, toast]);
  
  // Transform data for BrandsTable component
  const tableData = brands.map(brand => ({
    brand_id: brand.id,
    company_name: brand.companyName,
    email: brand.email,
    industry: brand.industry,
    budget_range: brand.budgetRange,
    total_deals: brand.totalDeals,
    active_deals: brand.activeDeals,
    last_active_at: brand.lastActive,
    status: brand.status
  }));
  
  return (
    <AdminCRMLayout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Brand Management</CardTitle>
          <p className="text-muted-foreground">
            Total Brands: {pagination?.total || 0}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search brands by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>
            
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <BrandsTable brands={tableData} isLoading={isLoading} />
        </CardContent>
      </Card>
    </AdminCRMLayout>
  );
};

export default BrandsCRM;
