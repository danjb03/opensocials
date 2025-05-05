
import { useState, useEffect } from 'react';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { projectToOrder } from '@/utils/orderUtils';
import { useQuery } from '@tanstack/react-query';

export const useOrderData = () => {
  const { toast } = useToast();

  // Fetch orders from Supabase using React Query
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      try {
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*')
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
    staleTime: 60000, // 1 minute
  });

  // This function is returned for backward compatibility
  const setOrders = (updaterFn: (prev: Order[]) => Order[]) => {
    console.log('Note: Direct state updates will not persist to the database.');
    // In a real implementation, this would make API calls to update the database
  };

  return {
    orders: orders || [],
    setOrders,
    isLoading
  };
};
