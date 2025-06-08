
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorCRMTable } from '@/components/admin/crm/creators/CreatorCRMTable';
import { CreatorCRMSearch } from '@/components/admin/crm/creators/CreatorCRMSearch';
import { useCreatorCRM } from '@/hooks/admin/useCreatorCRM';
import { Button } from '@/components/ui/button';

export default function CreatorsCRM() {
  const { creators, isLoading, error } = useCreatorCRM();

  // Transform creators data to match expected interface
  const transformedCreators = creators.map((creator: any) => ({
    creator_id: creator.id || creator.creator_id || '',
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Creator CRM</h1>
        <p className="text-muted-foreground">Manage and track creator relationships and performance.</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <CreatorCRMSearch onSearch={() => {}} initialValue="" />
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

      {!isLoading && !error && <CreatorCRMTable creators={transformedCreators} />}
    </div>
  );
}
