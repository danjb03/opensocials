import { useState, useEffect } from 'react';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { projectToOrder } from '@/utils/orderUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';

export const useOrderData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch orders from Supabase using React Query with the same key structure as projects
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      try {
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*')
          .eq('brand_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Map projects to orders
        return projects.map(project => projectToOrder(project));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: 'Error',
          description: 'Failed to load campaigns',
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });

  // Set up real-time subscription for campaigns/orders
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('campaigns-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `brand_id=eq.${user.id}`
      }, (payload) => {
        console.log('Campaign change detected:', payload);
        // Invalidate both campaigns and projects queries to keep them in sync
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        queryClient.invalidateQueries({ queryKey: ['projects', user.id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Function to refresh orders data
  const refreshOrders = () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
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
