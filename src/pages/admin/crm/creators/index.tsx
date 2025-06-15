
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorCRMTable } from '@/components/admin/crm/creators/CreatorCRMTable';
import { CreatorCRMSearch } from '@/components/admin/crm/creators/CreatorCRMSearch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

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
          .from('admin_crm_creators_view')
          .select('*');

        // Apply search filter
        if (searchTerm) {
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
        }

        // Apply platform filter
        if (platformFilter && platformFilter !== 'all') {
          query = query.eq('primary_platform', platformFilter);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(creator => ({
          creator_id: creator.creator_id || '',
          first_name: creator.first_name || '',
          last_name: creator.last_name || '',
          email: creator.email || '',
          primary_platform: creator.primary_platform || 'Instagram',
          follower_count: creator.follower_count || '0',
          engagement_rate: creator.engagement_rate || '0%',
          status: creator.status || 'active',
          total_deals: creator.total_deals || 0,
          active_deals: creator.active_deals || 0,
          last_active_at: creator.last_active_at || new Date().toISOString(),
        }));
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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Creator CRM</h1>
        <p className="text-muted-foreground">Manage and track creator relationships and performance.</p>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
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
        </div>
        
        <Button variant="outline" asChild>
          <Link to="/admin/crm/creators/leaderboard">View Leaderboard</Link>
        </Button>
      </div>

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
  );
}
