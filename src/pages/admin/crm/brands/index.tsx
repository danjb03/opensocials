
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { Skeleton } from '@/components/ui/skeleton';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import { BrandsTable } from '@/components/admin/crm/BrandsTable';
import { BrandPagination } from '@/components/admin/crm/BrandPagination';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Brand data interface
interface Brand {
  brand_id: string;
  company_name: string | null;
  email: string | null;
  industry: string | null;
  budget_range: string | null;
  total_deals: number | null;
  active_deals: number | null;
  last_active_at: string | null;
  status: string | null;
}

// Response interface for the API
interface BrandCRMResponse {
  success: boolean;
  data: Brand[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

// Pagination metadata interface
interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

const BrandsCRM = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const orderBy = searchParams.get('orderBy') || 'last_active_at';
  const orderDirection = searchParams.get('orderDirection') || 'desc';
  
  // Local state for form inputs
  const [search, setSearch] = useState(searchTerm);
  
  // Fetch brands data from the edge function
  const fetchBrands = async (): Promise<BrandCRMResponse> => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Build the URL with query parameters
    const url = new URL('/functions/v1/get-admin-crm', window.location.origin);
    url.searchParams.append('type', 'brand');
    url.searchParams.append('page', page.toString());
    url.searchParams.append('pageSize', pageSize.toString());
    url.searchParams.append('orderBy', orderBy);
    url.searchParams.append('orderDirection', orderDirection === 'asc' ? 'asc' : 'desc');
    
    if (searchTerm) {
      url.searchParams.append('search', searchTerm);
    }
    
    if (statusFilter && statusFilter !== 'all') {
      url.searchParams.append('status', statusFilter);
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch brand data');
    }
    
    return await response.json();
  };
  
  // Query hook for data fetching with proper type
  const { data, error, isLoading, isFetching } = useQuery<BrandCRMResponse, Error>({
    queryKey: ['adminBrands', page, pageSize, searchTerm, statusFilter, orderBy, orderDirection],
    queryFn: fetchBrands,
    // Removed keepPreviousData as it's not supported in this version
    staleTime: 30000
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
  
  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage.toString() });
    window.scrollTo(0, 0);
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
  
  // Get pagination data from the response
  const pagination: PaginationMeta = data?.pagination || {
    total: 0,
    page,
    pageSize,
    pageCount: 0
  };
  
  // Get brands data from the response
  const brands: Brand[] = data?.data || [];
  
  return (
    <AdminCRMLayout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Brand Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search form */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </form>
            
            {/* Status filter */}
            <div className="w-full md:w-64">
              <Select
                value={statusFilter}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Show loading state */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Display brands table */}
              <BrandsTable 
                brands={brands} 
                isLoading={isFetching} 
              />
              
              {/* Pagination controls */}
              {pagination?.total > 0 && (
                <div className="mt-4 flex justify-center">
                  <BrandPagination 
                    currentPage={pagination.page} 
                    totalPages={pagination.pageCount} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminCRMLayout>
  );
};

export default BrandsCRM;
