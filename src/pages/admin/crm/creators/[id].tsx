
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layouts/AdminLayout';

export default function CreatorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['creator-details', id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-creator-details-by-id', {
        body: { creator_id: id }
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const profile = data?.profile;
  const deals = data?.deals || [];
  const earnings = data?.totalEarnings || 0;

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        )}

        {isError || !data?.success ? (
          <p className="text-red-500 text-center mt-6">Failed to load creator details.</p>
        ) : (
          profile && (
            <>
              <h1 className="text-2xl font-bold mb-6">Creator Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{profile.first_name} {profile.last_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Email: {profile.email}</p>
                    <p>Platform: {profile.primary_platform}</p>
                    <p>Status: <Badge>{profile.status}</Badge></p>
                    <p>Followers: {profile.follower_count}</p>
                    <p>Engagement: {profile.engagement_rate}</p>
                    <p>Created: {new Date(profile.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">£{earnings.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal: any) => (
                      <TableRow key={deal.id}>
                        <TableCell>{deal.title}</TableCell>
                        <TableCell>{deal.brand_name}</TableCell>
                        <TableCell><Badge>{deal.status}</Badge></TableCell>
                        <TableCell>£{Number(deal.value).toLocaleString()}</TableCell>
                        <TableCell>{new Date(deal.updated_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {deals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No deals found for this creator.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )
        )}
      </div>
    </AdminLayout>
  );
}
