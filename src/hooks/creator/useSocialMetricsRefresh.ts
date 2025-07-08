
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSocialMetricsRefresh = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ platform, username }: { platform: string; username: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('trigger-social-scraping', {
        body: {
          user_id: user.id,
          platform,
          username
        }
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Metrics Refreshed!",
        description: `Successfully updated ${variables.platform} metrics for @${variables.username}`,
      });

      // Invalidate related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['social-metrics'] });
    },
    onError: (error: any) => {
      console.error('Metrics refresh error:', error);
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh social media metrics",
        variant: "destructive",
      });
    }
  });
};
