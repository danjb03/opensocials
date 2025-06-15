
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

type DealPipelineItem = {
  id: string;
  title: string;
  stage: string;
  status: string;
  value: number;
  updated_at: string;
  brand_name: string;
  creator_name: string;
  is_stuck: boolean;
};

export default function DealPipelinePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [stage, setStage] = useState(searchParams.get('stage') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  const { data: deals = [], isLoading, isError } = useQuery({
    queryKey: ['deal-pipeline', search, stage, status],
    queryFn: async (): Promise<DealPipelineItem[]> => {
      try {
        // Fetch deals without joins first
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('*');

        if (dealsError) throw dealsError;

        // Fetch brand profiles separately
        const { data: brandsData, error: brandsError } = await supabase
          .from('brand_profiles')
          .select('user_id, company_name');

        if (brandsError) throw brandsError;

        // Fetch creator profiles separately
        const { data: creatorsData, error: creatorsError } = await supabase
          .from('creator_profiles')
          .select('user_id, first_name, last_name');

        if (creatorsError) throw creatorsError;

        // Create lookup maps
        const brandMap = new Map(brandsData?.map(b => [b.user_id, b.company_name]) || []);
        const creatorMap = new Map(creatorsData?.map(c => [c.user_id, `${c.first_name || ''} ${c.last_name || ''}`.trim()]) || []);

        return (dealsData || []).map(deal => ({
          id: deal.id,
          title: deal.title,
          stage: deal.status || 'unknown',
          status: deal.status || 'active',
          value: deal.value || 0,
          updated_at: deal.updated_at,
          brand_name: brandMap.get(deal.brand_id) || 'Unknown Brand',
          creator_name: creatorMap.get(deal.creator_id) || 'Unknown Creator',
          is_stuck: false, // Mock data for now
        }));
      } catch (error) {
        console.error('Error fetching deals:', error);
        return [];
      }
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams({ search, stage, status });
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, stage, status, setSearchParams]);

  const filtered = deals.filter((deal) => {
    const matchSearch = search
      ? deal.creator_name.toLowerCase().includes(search.toLowerCase()) ||
        deal.brand_name.toLowerCase().includes(search.toLowerCase()) ||
        deal.title.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchStage = stage === 'all' || deal.stage === stage;
    const matchStatus = status === 'all' || deal.status === status;
    return matchSearch && matchStage && matchStatus;
  });

  return (
    <AdminCRMLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Deal Pipeline</h1>
          <p className="text-muted-foreground">Monitor and manage deal progress across all stages.</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search deals, brands, or creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />

          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
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
                  <TableRow 
                    key={deal.id} 
                    className={deal.is_stuck ? 'bg-red-50 border-l-4 border-red-500' : ''}
                  >
                    <TableCell>
                      {deal.title}
                      {deal.is_stuck && (
                        <Badge variant="destructive" className="ml-2">
                          Stuck
                        </Badge>
                      )}
                    </TableCell>
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
                    <TableCell>${Number(deal.value).toLocaleString()}</TableCell>
                    <TableCell>{new Date(deal.updated_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No deals found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminCRMLayout>
  );
}
