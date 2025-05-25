
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/orders';
import { projectToOrder } from '@/utils/orderUtils';
import { useScalableQuery } from '@/hooks/useScalableQuery';

export const useOrderData = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch orders from Supabase using scalable query system
  const { data: orders = [], isLoading, error, refetch } = useScalableQuery<Order[]>({
    baseKey: ['orders'],
    customQueryFn: async () => {
      try {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        const projectsData = await import('@/lib/userDataStore').then(({ userDataStore }) => 
          userDataStore.executeUserQuery('projects', '*', {})
        );

        // Map projects to orders
        return projectsData.map(project => projectToOrder(project));
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive',
        });
        return [];
      }
    },
    staleTime: 30000,
  });

  // Function to refresh orders data
  const refreshOrders = () => {
    refetch();
  };

  // This function is returned for backward compatibility
  const setOrders = (updaterFn: (prev: Order[]) => Order[]) => {
    console.log('Note: Direct state updates will not persist to the database.');
    // In a real implementation, this would make API calls to update the database
  };

  return {
    orders: orders || [],
    setOrders,
    isLoading,
    refreshOrders
  };
};
