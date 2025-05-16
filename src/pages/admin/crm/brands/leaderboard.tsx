
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader, Briefcase, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layouts/AdminLayout';

type BrandLeaderboardItem = {
  id: string;
  name: string;
  email: string;
  industry: string;
  total_budget: number;
};

export default function BrandLeaderboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['brand-leaderboard'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-brand-leaderboard');
        
        if (error) {
          console.error('Error fetching brand leaderboard:', error);
          throw new Error('Failed to fetch leaderboard data');
        }
        
        return data;
      } catch (err) {
        console.error('Exception in leaderboard fetch:', err);
        throw err;
      }
    },
  });

  const brands: BrandLeaderboardItem[] = data?.data || [];
  
  const getIndustryBadgeColor = (industry: string) => {
    const industries: Record<string, string> = {
      'technology': 'bg-blue-500',
      'fashion': 'bg-pink-500',
      'food': 'bg-green-500',
      'travel': 'bg-yellow-500',
      'beauty': 'bg-purple-500',
    };
    
    return industries[industry.toLowerCase()] || 'bg-gray-500';
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Briefcase className="mr-2 h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Top 50 Budget Brands</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget Leaderboard</CardTitle>
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
                    <TableHead>Brand</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead className="text-right">Total Budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No budget data available yet. Add brand deals with budgets to see brands here.
                      </TableCell>
                    </TableRow>
                  ) : (
                    brands.map((brand, i) => (
                      <TableRow key={brand.id}>
                        <TableCell>
                          <span className={`font-bold ${getMedalColor(i)}`}>{i + 1}</span>
                        </TableCell>
                        <TableCell>{brand.name || 'Unknown Brand'}</TableCell>
                        <TableCell>{brand.email}</TableCell>
                        <TableCell>
                          <Badge 
                            className={brand.industry && brand.industry !== 'N/A' 
                              ? getIndustryBadgeColor(brand.industry)
                              : undefined
                            }
                          >
                            {brand.industry || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            {Number(brand.total_budget).toLocaleString()}
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
  );
}
