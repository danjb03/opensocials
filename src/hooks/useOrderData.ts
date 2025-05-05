
import { useState, useEffect } from 'react';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { generateMockOrders } from '@/utils/orderUtils';

export const useOrderData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize orders from mock data
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch from an API here
        const mappedOrders = generateMockOrders();
        setOrders(mappedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load campaigns',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [toast]);

  return {
    orders,
    setOrders,
    isLoading
  };
};
