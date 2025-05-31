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

// Fetch payments for a project
export const useProjectPayments = (projectId: string) => {
  return useQuery({
    queryKey: ['project-payments', projectId],
    queryFn: async (): Promise<ProjectPayment[]> => {
      const { data, error } = await supabase
        .from('project_creator_payments')
        .select(`
          id,
          project_creator_id,
          amount,
          currency,
          milestone,
          status,
          payment_method,
          payment_provider_id,
          payment_provider_status,
          scheduled_date,
          processed_date,
          completed_date,
          created_at,
          updated_at,
          project_creators!project_creator_payments_project_creator_id_fkey (
            id,
            project_id,
            profiles!project_creators_creator_id_fkey (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('project_creators.project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project payments:', error);
        throw error;
      }

      return data?.map((payment: any) => ({
        id: payment.id,
        projectCreatorId: payment.project_creator_id,
        amount: payment.amount,
        currency: payment.currency,
        milestone: payment.milestone,
        status: payment.status,
        paymentMethod: payment.payment_method,
        paymentProviderId: payment.payment_provider_id,
        paymentProviderStatus: payment.payment_provider_status,
        scheduledDate: payment.scheduled_date,
        processedDate: payment.processed_date,
        completedDate: payment.completed_date,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        creatorInfo: {
          id: payment.project_creators?.profiles?.id,
          name: payment.project_creators?.profiles?.full_name,
          avatarUrl: payment.project_creators?.profiles?.avatar_url,
          projectId: payment.project_creators?.project_id,
        },
      })) || [];
    },
    enabled: !!projectId,
  });
};

// Fetch payments for a specific creator within a project
export const useProjectCreatorPayments = (projectCreatorId: string) => {
  return useQuery({
    queryKey: ['project-creator-payments', projectCreatorId],
    queryFn: async (): Promise<ProjectPayment[]> => {
      const { data, error } = await supabase
        .from('project_creator_payments')
        .select(`
          id,
          project_creator_id,
          amount,
          currency,
          milestone,
          status,
          payment_method,
          payment_provider_id,
          payment_provider_status,
          scheduled_date,
          processed_date,
          completed_date,
          created_at,
          updated_at
        `)
        .eq('project_creator_id', projectCreatorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creator payments:', error);
        throw error;
      }

      return data?.map((payment: any) => ({
        id: payment.id,
        projectCreatorId: payment.project_creator_id,
        amount: payment.amount,
        currency: payment.currency,
        milestone: payment.milestone,
        status: payment.status,
        paymentMethod: payment.payment_method,
        paymentProviderId: payment.payment_provider_id,
        paymentProviderStatus: payment.payment_provider_status,
        scheduledDate: payment.scheduled_date,
        processedDate: payment.processed_date,
        completedDate: payment.completed_date,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
      })) || [];
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
      const { data, error } = await supabase
        .from('project_creator_payments')
        .insert({
          project_creator_id: projectCreatorId,
          amount,
          currency,
          milestone,
          payment_method: paymentMethod,
          scheduled_date: scheduledDate,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Payment created successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-payments', data.project_creator_id] });
      queryClient.invalidateQueries({ queryKey: ['project-payments'] });
    },
    onError: (error) => {
      console.error('Failed to create payment:', error);
      toast.error('Failed to create payment. Please try again.');
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
      const updateData: any = { status };

      if (paymentProviderId) updateData.payment_provider_id = paymentProviderId;
      if (paymentProviderStatus) updateData.payment_provider_status = paymentProviderStatus;
      if (processedDate) updateData.processed_date = processedDate;
      if (completedDate) updateData.completed_date = completedDate;

      // Auto-set dates based on status
      if (status === 'processing' && !processedDate) {
        updateData.processed_date = new Date().toISOString();
      }
      if (status === 'completed' && !completedDate) {
        updateData.completed_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('project_creator_payments')
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
      queryClient.invalidateQueries({ queryKey: ['project-creator-payments', data.project_creator_id] });
      queryClient.invalidateQueries({ queryKey: ['project-payments'] });
    },
    onError: (error) => {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status. Please try again.');
    },
  });
};

// Process payment (simulate payment processing)
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
      // First update status to processing
      const { error: processingError } = await supabase
        .from('project_creator_payments')
        .update({
          status: 'processing',
          payment_method: paymentMethod,
          payment_provider_id: `${paymentMethod}_${Date.now()}`, // Mock provider ID
          processed_date: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (processingError) {
        console.error('Error processing payment:', processingError);
        throw processingError;
      }

      // Simulate payment processing delay (in real implementation, this would be handled by webhooks)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update status to completed
      const { data, error } = await supabase
        .from('project_creator_payments')
        .update({
          status: 'completed',
          payment_provider_status: 'succeeded',
          completed_date: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error completing payment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Payment processed successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creator-payments', data.project_creator_id] });
      queryClient.invalidateQueries({ queryKey: ['project-payments'] });
    },
    onError: (error) => {
      console.error('Failed to process payment:', error);
      toast.error('Failed to process payment. Please try again.');
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