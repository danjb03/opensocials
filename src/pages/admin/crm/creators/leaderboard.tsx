
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';

type LeaderboardItem = {
  id: string;
  name: string;
  email: string;
  platform: string;
  total_earnings: number;
};

export default function CreatorLeaderboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['creator-leaderboard'],
    queryFn: async () => {
      // Use Supabase client with proper URL construction
      const res = await fetch('https://pcnrnciwgdrukzciwexi.supabase.co/functions/v1/get-creator-leaderboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      return res.json();
    },
  });

  const creators: LeaderboardItem[] = data?.data || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Top 50 Earning Creators</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader className="animate-spin h-6 w-6" />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center">Failed to load leaderboard.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creators.map((creator, i) => (
                    <TableRow key={creator.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{creator.name}</TableCell>
                      <TableCell>{creator.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{creator.platform}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        £{Number(creator.total_earnings).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
