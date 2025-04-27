
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

const CreatorDeals = () => {
  const { user } = useAuth();

  const { data: deals = [] } = useQuery<Deal[]>({
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

      // Transform the data to match the Deal interface
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
