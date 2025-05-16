
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';

type CreatorCRMItem = {
  creator_id: string;
  first_name: string;
  last_name: string;
  email: string;
  primary_platform: string;
  follower_count: string;
  engagement_rate: string;
  status: string;
  total_deals: number;
  active_deals: number;
  last_active_at: string;
};

export default function CreatorsCRM() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const query = {
    page: Number(searchParams.get('page')) || 1,
    pageSize: 10,
    search: searchParams.get('search') || '',
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['creators', query],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-admin-creator-crm', {
        body: query
      });
      
      if (error) throw new Error(error.message);
      return data;
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams({ search, page: '1' });
      refetch();
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, setSearchParams, refetch]);

  return (
    <AdminCRMLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Creator CRM</h1>
          <Input
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        )}

        {isError && <p className="text-red-500">Failed to load data.</p>}

        {!isLoading && data?.data?.length === 0 && (
          <p className="text-gray-500 text-center py-8">No creators found.</p>
        )}

        {!isLoading && data?.data?.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((creator: CreatorCRMItem) => (
                  <TableRow key={creator.creator_id}>
                    <TableCell>
                      {creator.first_name} {creator.last_name}
                    </TableCell>
                    <TableCell>{creator.email}</TableCell>
                    <TableCell>{creator.primary_platform}</TableCell>
                    <TableCell>{creator.follower_count}</TableCell>
                    <TableCell>{creator.engagement_rate}</TableCell>
                    <TableCell>
                      <Badge variant={creator.status === 'active' ? 'default' : 'outline'}>
                        {creator.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {creator.active_deals}/{creator.total_deals}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminCRMLayout>
  );
}
