
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ['deal-pipeline'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-admin-deals-pipeline');
      
      if (error) throw error;
      return data;
    },
  });

  const deals: DealPipelineItem[] = data?.data || [];

  return (
    <AdminCRMLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Deal Pipeline</h1>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        )}

        {isError && <p className="text-red-500 text-center">Failed to load deal data.</p>}

        {!isLoading && deals.length > 0 && (
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
                {deals.map((deal) => (
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

        {!isLoading && deals.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No deals found.</p>
          </div>
        )}
      </div>
    </AdminCRMLayout>
  );
}
