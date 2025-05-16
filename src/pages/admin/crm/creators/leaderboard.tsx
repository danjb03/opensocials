
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader, Award, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layouts/AdminLayout';

type LeaderboardItem = {
  id: string;
  name: string;
  email: string;
  platform: string;
  total_earnings: number;
};

export default function CreatorLeaderboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['creator-leaderboard'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-creator-leaderboard');
        
        if (error) {
          console.error('Error fetching leaderboard:', error);
          throw new Error('Failed to fetch leaderboard data');
        }
        
        return data;
      } catch (err) {
        console.error('Exception in leaderboard fetch:', err);
        throw err;
      }
    },
  });

  const creators: LeaderboardItem[] = data?.data || [];
  
  const getPlatformBadgeColor = (platform: string) => {
    const platforms: Record<string, string> = {
      'instagram': 'bg-pink-500',
      'tiktok': 'bg-black',
      'youtube': 'bg-red-500',
      'twitter': 'bg-blue-400',
      'linkedin': 'bg-blue-600',
    };
    
    return platforms[platform.toLowerCase()] || 'bg-gray-500';
  };

  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return 'text-yellow-400'; // Gold
      case 1: return 'text-gray-400'; // Silver
      case 2: return 'text-amber-700'; // Bronze
      default: return 'text-gray-300';
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Award className="mr-2 h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-bold">Top 50 Earning Creators</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader className="animate-spin h-6 w-6" />
              </div>
            ) : isError ? (
              <div className="p-4 text-center">
                <p className="text-red-500">Failed to load leaderboard data.</p>
                <p className="text-sm text-muted-foreground mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No earnings data available yet. Add deals with earnings to see creators here.
                        </TableCell>
                      </TableRow>
                    ) : (
                      creators.map((creator, i) => (
                        <TableRow key={creator.id}>
                          <TableCell>
                            <span className={`font-bold ${getMedalColor(i)}`}>{i + 1}</span>
                          </TableCell>
                          <TableCell>{creator.name || 'Unknown Creator'}</TableCell>
                          <TableCell>{creator.email}</TableCell>
                          <TableCell>
                            <Badge 
                              className={creator.platform && creator.platform !== 'N/A' 
                                ? getPlatformBadgeColor(creator.platform)
                                : undefined
                              }
                            >
                              {creator.platform || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <div className="flex items-center justify-end">
                              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                              {Number(creator.total_earnings).toLocaleString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
