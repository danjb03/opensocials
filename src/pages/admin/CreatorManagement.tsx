
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Check } from 'lucide-react';
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';

const fetchCreators = async ({ page, pageSize, search, status, platform }) => {
  const { data, error } = await supabase.functions.invoke('get-admin-creator-crm', {
    body: { page, pageSize, search, status, platform }
  });
  
  if (error) throw new Error(error.message);
  return data;
};

const CreatorManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'all');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const pageSize = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['creators', { page, pageSize, search, status, platform }],
    queryFn: () => fetchCreators({ page, pageSize, search, status, platform })
  });

  // Update URL params when filters change, but don't trigger on every render
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    if (platform !== 'all') params.set('platform', platform);
    if (page !== 1) params.set('page', String(page));
    
    // Update URL params only if they've changed
    const currentParams = new URLSearchParams(searchParams);
    const newParamsString = params.toString();
    const currentParamsString = currentParams.toString();
    
    if (newParamsString !== currentParamsString) {
      setSearchParams(params, { replace: true });
    }
  }, [search, status, platform, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Creator Management</h1>
        <Button>
          Add New Creator
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
        <Select 
          value={status} 
          onValueChange={(value) => {
            setStatus(value);
            setPage(1); // Reset to first page when filter changes
          }}
        >
          <SelectTrigger className="w-full md:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={platform} 
          onValueChange={(value) => {
            setPlatform(value);
            setPage(1); // Reset to first page when filter changes
          }}
        >
          <SelectTrigger className="w-full md:w-36">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading creators...</p>
        </div>
      ) : isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">Error loading creators. Please try again later.</p>
        </div>
      ) : data && data.data && data.data.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Deals</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((creator) => (
                  <TableRow key={creator.creator_id}>
                    <TableCell className="font-medium">
                      {creator.first_name} {creator.last_name}
                    </TableCell>
                    <TableCell>{creator.email}</TableCell>
                    <TableCell>{creator.primary_platform || 'N/A'}</TableCell>
                    <TableCell>{creator.follower_count || '0'}</TableCell>
                    <TableCell>{creator.engagement_rate || '0%'}</TableCell>
                    <TableCell>{creator.total_deals || '0'}</TableCell>
                    <TableCell>
                      <div className={`flex items-center justify-center w-24 rounded-full px-2 py-1 text-xs font-medium ${
                        creator.status === 'active' ? 'bg-green-100 text-green-800' :
                        creator.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {creator.status === 'active' && <Check className="mr-1 h-3 w-3" />}
                        {creator.status?.charAt(0).toUpperCase() + creator.status?.slice(1) || 'Unknown'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.pageCount > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: data.pagination.pageCount }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - page) < 3 || p === 1 || p === data.pagination.pageCount)
                  .map((p, i, arr) => {
                    // Add ellipsis
                    if (i > 0 && p > arr[i-1] + 1) {
                      return (
                        <PaginationItem key={`ellipsis-${p}`}>
                          <span className="flex h-9 w-9 items-center justify-center">...</span>
                        </PaginationItem>
                      );
                    }
                    
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink 
                          isActive={page === p} 
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(data.pagination.pageCount, page + 1))}
                    className={page >= data.pagination.pageCount ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No creators found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default CreatorManagement;
