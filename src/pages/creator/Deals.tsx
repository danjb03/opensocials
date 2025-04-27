
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import PendingDeals from '@/components/deals/PendingDeals';
import PastDeals from '@/components/deals/PastDeals';

interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  profiles: {
    company_name: string;
  };
}

const SAMPLE_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Summer Fashion Campaign',
    description: 'Promote our new summer collection on your social media platforms',
    value: 2500,
    status: 'pending',
    feedback: null,
    creator_id: '1',
    brand_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      company_name: 'Fashion Brand Co.'
    }
  },
  {
    id: '2',
    title: 'Tech Product Review',
    description: 'Detailed review of our latest smartphone',
    value: 3000,
    status: 'pending',
    feedback: null,
    creator_id: '1',
    brand_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      company_name: 'TechGear Inc.'
    }
  },
  {
    id: '3',
    title: 'Fitness App Promotion',
    description: 'Create a workout video using our app',
    value: 1800,
    status: 'accepted',
    feedback: null,
    creator_id: '1',
    brand_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      company_name: 'FitLife App'
    }
  },
  {
    id: '4',
    title: 'Beauty Products Campaign',
    description: 'Skincare routine featuring our products',
    value: 2000,
    status: 'declined',
    feedback: 'Timeline conflicts with other commitments',
    creator_id: '1',
    brand_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      company_name: 'Glow Beauty'
    }
  }
];

const CreatorDeals = () => {
  const { user } = useAuth();

  const { data: deals = SAMPLE_DEALS } = useQuery<Deal[]>({
    queryKey: ['creator-deals', user?.id],
    queryFn: async () => {
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select(`
          *,
          profiles:brand_id(company_name)
        `)
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        throw dealsError;
      }

      return (dealsData || []).map((deal: any) => ({
        ...deal,
        profiles: {
          company_name: deal.profiles?.company_name || 'Unknown Brand'
        }
      }));
    },
    enabled: !!user?.id,
  });

  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const otherDeals = deals.filter(deal => deal.status !== 'pending');

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-6">
        <PendingDeals deals={pendingDeals} />
        <PastDeals deals={otherDeals} />
      </div>
    </CreatorLayout>
  );
};

export default CreatorDeals;
