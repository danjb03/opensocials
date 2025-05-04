
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectStatus } from '@/types/projects';
import { ContentRequirements } from '@/types/project';
import { stepStatusMap } from '@/constants/campaignSteps';

export function useCampaignProgress(projectId: string | undefined) {
  const [nextStepBlocked, setNextStepBlocked] = useState(false);
  const [showBlockedAlert, setShowBlockedAlert] = useState(false);
  const { toast } = useToast();
  
  // Function to check if the current step should block progression
  const checkStepBlocked = (step: number, contentReqs: ContentRequirements | null) => {
    // Block "Next Step" when on Creative Planning without brief upload
    if (step === 3 && !(contentReqs?.brief_uploaded)) {
      setNextStepBlocked(true);
    } else {
      setNextStepBlocked(false);
    }
  };

  const updateCampaignStatus = async (newStep: number): Promise<boolean> => {
    if (!projectId) return false;
    
    try {
      // Map step to status using our map from constants
      const newStatus = stepStatusMap[newStep] as ProjectStatus || 'new';
      
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: 'Campaign Updated',
        description: `Campaign moved to next step`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Could not update campaign status',
        variant: 'destructive',
      });
      return false;
    }
  };

  const showBlockedMessage = () => {
    setShowBlockedAlert(true);
    toast({
      title: 'Action Required',
      description: 'You must upload a brief before proceeding to the next step.',
      variant: 'destructive',
    });
  };

  const hideBlockedAlert = () => {
    setShowBlockedAlert(false);
  };

  return {
    nextStepBlocked,
    showBlockedAlert,
    checkStepBlocked,
    updateCampaignStatus,
    showBlockedMessage,
    hideBlockedAlert
  };
}
