
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/orders';
import { projectToOrder } from '@/utils/orderUtils';
import { useScalableQuery } from '@/hooks/useScalableQuery';

export const useOrderData = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch orders from Supabase using scalable query system - same approach as useProjects
  const { data: orders = [], isLoading, error, refetch } = useScalableQuery<Order[]>({
    baseKey: ['orders'],
    customQueryFn: async () => {
      if (!user?.id) {
        console.log('🚫 No user found, returning empty array');
        return [];
      }
      
      console.log('🔍 Fetching projects for orders conversion, user:', user.id);
      
      try {
        const projectsData = await import('@/lib/userDataStore').then(({ userDataStore }) => 
          userDataStore.executeUserQuery('projects', '*', {})
        );

        console.log('📊 Raw projects data for orders:', projectsData);

        // Validate the response structure - same as useProjects
        if (!projectsData || typeof projectsData === 'string') {
          console.error('❌ Invalid projects data:', projectsData);
          return [];
        }

        // Check if it's an error response
        if ((projectsData as any)?.error) {
          console.error('❌ Error in projects data:', projectsData);
          return [];
        }

        // Ensure projectsData is an array
        if (!Array.isArray(projectsData)) {
          console.error('❌ Projects data is not an array:', projectsData);
          return [];
        }

        // Transform projects to orders
        const orders: Order[] = [];
        
        for (const item of projectsData) {
          // Skip null, undefined, or non-object items
          if (!item || typeof item !== 'object') {
            continue;
          }

          // Skip error objects
          if ('error' in (item as Record<string, any>)) {
            continue;
          }

          const projectItem = item as Record<string, any>;
          
          // Validate required fields for project
          if (typeof projectItem.id === 'string' &&
              typeof projectItem.name === 'string') {
            
            try {
              const order = projectToOrder(projectItem);
              orders.push(order);
            } catch (error) {
              console.warn('⚠️ Failed to convert project to order:', projectItem.id, error);
              continue;
            }
          }
        }

        console.log('✅ Orders transformed from projects:', orders.length, 'orders');
        
        return orders;
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
    staleTime: 30000, // Same as useProjects
    refetchOnWindowFocus: true,
  });

  // Handle error
  if (error) {
    console.error('❌ Error in useOrderData:', error);
    toast({
      title: "Error",
      description: "Failed to load orders. Please try again.",
      variant: "destructive",
    });
  }

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
