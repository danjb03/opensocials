
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, DollarSign } from 'lucide-react';

interface LeaderboardItem {
  id: string;
  total_earnings: number;
  name: string;
  email: string;
  platform: string;
}

export function CreatorLeaderboard() {
  const fetchLeaderboardData = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error('Authentication required');
      }
      
      const supabaseUrl = "https://pcnrnciwgdrukzciwexi.supabase.co";
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/get-creator-leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leaderboard data');
      }
      
      const data = await response.json();
      return data.data as LeaderboardItem[];
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      throw error;
    }
  };

  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ['creatorLeaderboard'],
    queryFn: fetchLeaderboardData,
  });

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-6 w-6 text-amber-500" />
          Top Earning Creators
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="py-8 text-center text-red-500">
            Error loading leaderboard data. Please try again later.
          </div>
        )}
        
        {!isLoading && !error && leaderboard?.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No earnings data available yet.
          </div>
        )}
        
        {!isLoading && !error && leaderboard && leaderboard.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Total Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className={`font-bold ${getMedalColor(index)}`}>{index + 1}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name || 'Unknown Creator'}</div>
                        <div className="text-sm text-muted-foreground">{item.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.platform && item.platform !== 'N/A' ? (
                        <Badge className={`${getPlatformBadgeColor(item.platform)} text-white`}>
                          {item.platform}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not specified</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        {item.total_earnings.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
