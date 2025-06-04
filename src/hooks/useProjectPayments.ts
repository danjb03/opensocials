
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

// Fetch payments for a project - temporarily disabled since table doesn't exist
export const useProjectPayments = (projectId: string) => {
  return useQuery({
    queryKey: ['project-payments', projectId],
    queryFn: async (): Promise<ProjectPayment[]> => {
      console.log('Project payments table not available yet');
      return [];
    },
    enabled: !!projectId,
  });
};

// Fetch payments for a specific creator within a project - temporarily disabled
export const useProjectCreatorPayments = (projectCreatorId: string) => {
  return useQuery({
    queryKey: ['project-creator-payments', projectCreatorId],
    queryFn: async (): Promise<ProjectPayment[]> => {
      console.log('Project creator payments table not available yet');
      return [];
    },
    enabled: !!projectCreatorId,
  });
};

// Create a new payment - temporarily disabled
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
      console.log('Payment creation not available yet - project_creator_payments table missing');
      throw new Error('Payment creation functionality not available yet');
    },
    onSuccess: (data) => {
      toast.success('Payment created successfully');
    },
    onError: (error) => {
      console.error('Failed to create payment:', error);
      toast.error('Payment creation not available yet');
    },
  });
};

// Update payment status - temporarily disabled
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
      console.log('Payment status update not available yet - project_creator_payments table missing');
      throw new Error('Payment status update functionality not available yet');
    },
    onSuccess: (data) => {
      toast.success('Payment status updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update payment status:', error);
      toast.error('Payment status update not available yet');
    },
  });
};

// Process payment - temporarily disabled
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
      console.log('Payment processing not available yet - project_creator_payments table missing');
      throw new Error('Payment processing functionality not available yet');
    },
    onSuccess: (data) => {
      toast.success('Payment processed successfully');
    },
    onError: (error) => {
      console.error('Failed to process payment:', error);
      toast.error('Payment processing not available yet');
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
