
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader, Award, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/ui/data-table';

type LeaderboardItem = {
  id: string;
  name: string;
  email: string;
  platform: string;
  total_earnings: number;
};

export default function CreatorLeaderboardPage() {
  const navigate = useNavigate();
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

  const handleCreatorClick = (creator: LeaderboardItem) => {
    navigate(`/admin/crm/creators/${creator.id}`);
  };

  const columns = [
    {
      accessorKey: 'index',
      header: '#',
      cell: ({ row }: { row: any }) => {
        return (
          <span className={`font-bold ${getMedalColor(row.index)}`}>
            {row.index + 1}
          </span>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Creator',
      cell: ({ row }: { row: any }) => {
        const creator = row.original;
        return (
          <div>
            <div className="font-medium">{creator.name || 'Unknown Creator'}</div>
            <div className="text-sm text-muted-foreground">{creator.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }: { row: any }) => {
        const platform = row.original.platform;
        return platform && platform !== 'N/A' ? (
          <Badge className={`${getPlatformBadgeColor(platform)} text-white`}>
            {platform}
          </Badge>
        ) : (
          <Badge variant="outline">Unknown</Badge>
        );
      },
    },
    {
      accessorKey: 'total_earnings',
      header: () => <div className="text-right">Earnings</div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex items-center justify-end">
            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
            {Number(row.original.total_earnings).toLocaleString()}
          </div>
        );
      },
    }
  ];

  return (
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
            <DataTable
              columns={columns}
              data={creators}
              onRowClick={handleCreatorClick}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
