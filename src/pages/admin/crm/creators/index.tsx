
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorCRMTable } from '@/components/admin/crm/creators/CreatorCRMTable';
import { CreatorCRMSearch } from '@/components/admin/crm/creators/CreatorCRMSearch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');

  const { data: creators = [], isLoading, error } = useQuery({
    queryKey: ['admin-creators-crm', searchTerm, platformFilter],
    queryFn: async (): Promise<CreatorCRMItem[]> => {
      try {
        let query = supabase
          .from('creator_profiles')
          .select(`
            id,
            user_id,
            first_name,
            last_name,
            primary_platform,
            follower_count,
            engagement_rate,
            created_at,
            profiles!inner(email, status)
          `);

        // Apply search filter
        if (searchTerm) {
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`);
        }

        // Apply platform filter
        if (platformFilter && platformFilter !== 'all') {
          query = query.eq('primary_platform', platformFilter);
        }

        const { data: creatorData, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Get deal counts for each creator
        const creatorsWithDeals = await Promise.all(
          (creatorData || []).map(async (creator) => {
            const { data: deals } = await supabase
              .from('creator_deals')
              .select('status')
              .eq('creator_id', creator.user_id);

            const totalDeals = deals?.length || 0;
            const activeDeals = deals?.filter(deal => deal.status === 'active' || deal.status === 'accepted').length || 0;

            return {
              creator_id: creator.user_id || creator.id,
              first_name: creator.first_name || '',
              last_name: creator.last_name || '',
              email: creator.profiles?.email || '',
              primary_platform: creator.primary_platform || 'Instagram',
              follower_count: creator.follower_count?.toString() || '0',
              engagement_rate: creator.engagement_rate ? `${creator.engagement_rate}%` : '0%',
              status: creator.profiles?.status || 'active',
              total_deals: totalDeals,
              active_deals: activeDeals,
              last_active_at: creator.created_at || new Date().toISOString(),
            };
          })
        );

        return creatorsWithDeals;
      } catch (error) {
        console.error('Error fetching creators:', error);
        throw error;
      }
    },
  });

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <AdminCRMLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Creator CRM</h1>
          <p className="text-muted-foreground">
            Total Creators: {creators.length} | Manage and track creator relationships and performance.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <CreatorCRMSearch onSearch={handleSearch} initialValue={searchTerm} />
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" asChild>
                <Link to="/admin/crm/creators/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        )}

        {error && (
          <div className="text-red-500 py-6">
            <p>Failed to load creator data. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && <CreatorCRMTable creators={creators} />}
      </div>
    </AdminCRMLayout>
  );
}
