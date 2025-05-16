
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import { supabase } from '@/integrations/supabase/client';
import qs from 'query-string';

type DealPipelineItem = {
  id: string;
  title: string;
  stage: string;
  status: string;
  value: number;
  updated_at: string;
  brand_name: string;
  creator_name: string;
};

export default function DealPipelinePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [stage, setStage] = useState(searchParams.get('stage') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const query = {
    search,
    stage,
    status,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['deal-pipeline', query],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-admin-deals-pipeline');
      
      if (error) throw error;
      return data;
    },
  });

  const deals: DealPipelineItem[] = data?.data || [];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams({ search, stage, status });
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, stage, status, setSearchParams]);

  const filtered = deals.filter((deal) => {
    const matchSearch = search
      ? deal.creator_name.toLowerCase().includes(search.toLowerCase()) ||
        deal.brand_name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchStage = stage ? deal.stage === stage : true;
    const matchStatus = status ? deal.status === status : true;
    return matchSearch && matchStage && matchStatus;
  });

  return (
    <AdminCRMLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Deal Pipeline</h1>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search brand or creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />

          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Stages</SelectItem>
              <SelectItem value="briefed">Briefed</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="launched">Launched</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        )}

        {isError && <p className="text-red-500 text-center">Failed to load deal data.</p>}

        {!isLoading && filtered.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>{deal.title}</TableCell>
                    <TableCell>{deal.brand_name}</TableCell>
                    <TableCell>{deal.creator_name}</TableCell>
                    <TableCell>
                      <Badge variant={deal.status === 'active' ? 'default' : 'outline'}>
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{deal.stage}</Badge>
                    </TableCell>
                    <TableCell>£{Number(deal.value).toLocaleString()}</TableCell>
                    <TableCell>{new Date(deal.updated_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No deals found.</p>
          </div>
        )}
      </div>
    </AdminCRMLayout>
  );
}
