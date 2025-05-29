
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/orders';
import { projectToOrder } from '@/utils/orderUtils';
import { useScalableQuery } from '@/hooks/useScalableQuery';

export const useOrderData = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  console.log('🔍 useOrderData hook initialized for user:', user?.id);

  // Fetch orders from Supabase using scalable query system - same approach as useProjects
  const { data: orders = [], isLoading, error, refetch } = useScalableQuery<Order[]>({
    baseKey: ['orders'],
    customQueryFn: async () => {
      if (!user?.id) {
        console.log('🚫 No user found in customQueryFn, returning empty array');
        return [];
      }
      
      console.log('🔍 Fetching projects for orders conversion, user:', user.id);
      
      try {
        const projectsData = await import('@/lib/userDataStore').then(({ userDataStore }) => 
          userDataStore.executeUserQuery('projects', '*', {})
        );

        console.log('📊 Raw projects data for orders:', {
          type: typeof projectsData,
          isArray: Array.isArray(projectsData),
          count: Array.isArray(projectsData) ? projectsData.length : 'not array',
          data: projectsData
        });

        // Validate the response structure - same as useProjects
        if (!projectsData || typeof projectsData === 'string') {
          console.error('❌ Invalid projects data - not an object:', projectsData);
          return [];
        }

        // Check if it's an error response
        if ((projectsData as any)?.error) {
          console.error('❌ Error in projects data:', projectsData);
          return [];
        }

        // Ensure projectsData is an array
        if (!Array.isArray(projectsData)) {
          console.error('❌ Projects data is not an array:', {
            type: typeof projectsData,
            keys: Object.keys(projectsData as any),
            data: projectsData
          });
          return [];
        }

        console.log('📋 Processing projects array:', {
          totalProjects: projectsData.length,
          projects: projectsData.map(p => {
            // Type guard to ensure p is not null and is an object with the expected properties
            if (p && typeof p === 'object' && !('error' in p)) {
              const project = p as Record<string, any>;
              return { 
                id: project.id, 
                name: project.name, 
                status: project.status 
              };
            }
            return { id: 'invalid', name: 'invalid', status: 'invalid' };
          })
        });

        // Transform projects to orders
        const orders: Order[] = [];
        
        for (const [index, item] of projectsData.entries()) {
          // Type guard: check if item is a valid object and not an error
          if (!item || typeof item !== 'object' || 'error' in (item as Record<string, any>)) {
            console.warn(`⚠️ Skipping invalid or error item at index ${index}:`, item);
            continue;
          }

          const projectItem = item as Record<string, any>;
          
          console.log(`🔄 Processing project ${index + 1}/${projectsData.length}:`, {
            id: projectItem?.id,
            name: projectItem?.name,
            type: typeof projectItem,
            hasRequiredFields: !!(projectItem?.id && projectItem?.name)
          });

          // Validate required fields for project
          if (typeof projectItem.id === 'string' &&
              typeof projectItem.name === 'string') {
            
            try {
              console.log(`✅ Converting project to order:`, {
                id: projectItem.id,
                name: projectItem.name,
                status: projectItem.status
              });
              const order = projectToOrder(projectItem);
              orders.push(order);
              console.log(`✅ Successfully converted project to order:`, {
                orderId: order.id,
                orderTitle: order.title,
                orderStage: order.stage
              });
            } catch (error) {
              console.warn(`⚠️ Failed to convert project to order:`, {
                projectId: projectItem.id,
                projectName: projectItem.name,
                error: error
              });
              continue;
            }
          } else {
            console.warn(`⚠️ Project missing required fields:`, {
              id: typeof projectItem.id,
              name: typeof projectItem.name,
              projectItem
            });
          }
        }

        console.log('✅ Orders transformation complete:', {
          totalProjectsProcessed: projectsData.length,
          ordersCreated: orders.length,
          orders: orders.map(o => ({ id: o.id, title: o.title, stage: o.stage }))
        });
        
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

  console.log('🎯 useOrderData final state:', {
    isLoading,
    error: error?.message,
    ordersCount: orders?.length || 0,
    orders: orders?.map(o => ({ id: o.id, title: o.title, stage: o.stage }))
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
    console.log('🔄 Refreshing orders data');
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
