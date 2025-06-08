import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProjectPayment {
  id: string;
  projectCreatorId: string;
  amount: number;
  currency: string;
  milestone: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: string;
  paymentProviderId?: string;
  paymentProviderStatus?: string;
  scheduledDate?: string;
  processedDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  creatorInfo?: {
    id: string;
    name: string;
    avatarUrl?: string;
    projectId: string;
  };
}

// Map database payment status to ProjectPayment status
function mapPaymentStatus(dbStatus: string): ProjectPayment['status'] {
  switch (dbStatus) {
    case 'paid': return 'completed';
    case 'processing': return 'processing';
    case 'pending': return 'pending';
    case 'failed': return 'failed';
    case 'cancelled': return 'cancelled';
    default: return 'pending';
  }
}

// Fetch payments for a project
export const useProjectPayments = (projectId: string) => {
  return useQuery({
    queryKey: ['project-payments', projectId],
    queryFn: async (): Promise<ProjectPayment[]> => {
      // Now fetch from real creator_deals table
      const { data: deals, error } = await supabase
        .from('creator_deals')
        .select(`
          id,
          deal_value,
          status,
          payment_status,
          paid_at,
          created_at,
          updated_at,
          creator_id
        `)
        .eq('project_id', projectId);

      if (error) {
        console.error('Error fetching project payments:', error);
        throw error;
      }

      // Fetch creator profiles separately
      const paymentsWithCreators = await Promise.all(
        (deals || []).map(async (deal) => {
          const { data: creator } = await supabase
            .from('creator_profiles')
            .select('user_id, first_name, last_name')
            .eq('user_id', deal.creator_id)
            .single();

          return {
            id: deal.id,
            projectCreatorId: deal.id, // Using deal id as project creator id
            amount: deal.deal_value,
            currency: 'USD',
            milestone: 'completion',
            status: mapPaymentStatus(deal.payment_status),
            scheduledDate: deal.created_at,
            processedDate: deal.payment_status === 'processing' ? deal.created_at : undefined,
            completedDate: deal.paid_at || undefined,
            createdAt: deal.created_at,
            updatedAt: deal.updated_at,
            creatorInfo: {
              id: creator?.user_id || '',
              name: creator ? `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Unknown Creator' : 'Unknown Creator',
              projectId: projectId
            }
          };
        })
      );

      return paymentsWithCreators;
    },
    enabled: !!projectId,
  });
};

// Fetch payments for a specific creator within a project
export const useProjectCreatorPayments = (projectCreatorId: string) => {
  return useQuery({
    queryKey: ['project-creator-payments', projectCreatorId],
    queryFn: async (): Promise<ProjectPayment[]> => {
      const { data: deal, error } = await supabase
        .from('creator_deals')
        .select(`
          id,
          deal_value,
          status,
          payment_status,
          paid_at,
          created_at,
          updated_at,
          project_id,
          creator_id
        `)
        .eq('id', projectCreatorId)
        .single();

      if (error) {
        console.error('Error fetching creator payment:', error);
        throw error;
      }

      if (!deal) return [];

      // Fetch creator profile separately
      const { data: creator } = await supabase
        .from('creator_profiles')
        .select('user_id, first_name, last_name')
        .eq('user_id', deal.creator_id)
        .single();

      return [{
        id: deal.id,
        projectCreatorId: deal.id,
        amount: deal.deal_value,
        currency: 'USD',
        milestone: 'completion',
        status: mapPaymentStatus(deal.payment_status),
        scheduledDate: deal.created_at,
        processedDate: deal.payment_status === 'processing' ? deal.created_at : undefined,
        completedDate: deal.paid_at || undefined,
        createdAt: deal.created_at,
        updatedAt: deal.updated_at,
        creatorInfo: {
          id: creator?.user_id || '',
          name: creator ? `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Unknown Creator' : 'Unknown Creator',
          projectId: deal.project_id
        }
      }];
    },
    enabled: !!projectCreatorId,
  });
};

// Create a new payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectCreatorId,
      amount,
      currency = 'USD',
      milestone,
      paymentMethod,
      scheduledDate,
    }: {
      projectCreatorId: string;
      amount: number;
      currency?: string;
      milestone: string;
      paymentMethod?: string;
      scheduledDate?: string;
    }) => {
      // Update the deal payment status
      const { data, error } = await supabase
        .from('creator_deals')
        .update({
          payment_status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectCreatorId)
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Payment processed successfully');
      queryClient.invalidateQueries({ queryKey: ['project-payments'] });
      queryClient.invalidateQueries({ queryKey: ['project-creator-payments'] });
    },
    onError: (error) => {
      console.error('Failed to create payment:', error);
      toast.error('Failed to process payment');
    },
  });
};

// Update payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      status,
      paymentProviderId,
      paymentProviderStatus,
      processedDate,
      completedDate,
    }: {
      paymentId: string;
      status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
      paymentProviderId?: string;
      paymentProviderStatus?: string;
      processedDate?: string;
      completedDate?: string;
    }) => {
      const updateData: any = {
        payment_status: status === 'completed' ? 'paid' : status,
        updated_at: new Date().toISOString()
      };

      if (completedDate && status === 'completed') {
        updateData.paid_at = completedDate;
      }

      const { data, error } = await supabase
        .from('creator_deals')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Payment status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['project-payments'] });
      queryClient.invalidateQueries({ queryKey: ['project-creator-payments'] });
    },
    onError: (error) => {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status');
    },
  });
};

// Process payment
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      paymentMethod,
    }: {
      paymentId: string;
      paymentMethod: string;
    }) => {
      const { data, error } = await supabase
        .from('creator_deals')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error processing payment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Payment processed successfully');
      queryClient.invalidateQueries({ queryKey: ['project-payments'] });
      queryClient.invalidateQueries({ queryKey: ['project-creator-payments'] });
    },
    onError: (error) => {
      console.error('Failed to process payment:', error);
      toast.error('Failed to process payment');
    },
  });
};

// Calculate total payments for a project
export const useProjectPaymentSummary = (projectId: string) => {
  const { data: payments, ...query } = useProjectPayments(projectId);

  const summary = React.useMemo(() => {
    if (!payments) return null;

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedAmount = payments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = payments
      .filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const processingAmount = payments
      .filter(payment => payment.status === 'processing')
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalAmount,
      completedAmount,
      pendingAmount,
      processingAmount,
      totalPayments: payments.length,
      completedPayments: payments.filter(p => p.status === 'completed').length,
    };
  }, [payments]);

  return {
    ...query,
    data: payments,
    summary,
  };
};
