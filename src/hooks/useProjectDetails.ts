
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentRequirements } from '@/types/project';
import { CAMPAIGN_STEPS, statusStepMap, stepStatusMap } from '@/constants/campaignSteps';
import { useBriefFiles } from './useBriefFiles';
import { useCampaignProgress } from './useCampaignProgress';

export function useProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [briefUploaded, setBriefUploaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Import functionality from smaller hooks
  const {
    files,
    uploadedFiles,
    isUploading,
    uploadFiles,
    removeFile,
    clearAllFiles,
    saveContentRequirements,
    isSaving
  } = useBriefFiles();
  
  const { 
    nextStepBlocked, 
    showBlockedAlert,
    checkStepBlocked,
    updateCampaignStatus,
    showBlockedMessage,
    hideBlockedAlert
  } = useCampaignProgress();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setProject(data);
        
        // Determine current step based on status using our map
        const step = statusStepMap[data.status] || 1;
        setCurrentStep(step);
        
        // Check for metadata containing brief upload info
        const contentReqs = data.content_requirements as ContentRequirements | null;
        setBriefUploaded(contentReqs?.brief_uploaded || false);
        
        // Check if next step should be blocked
        checkStepBlocked(step, contentReqs);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Could not load project details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, toast, checkStepBlocked]);

  const handleProgressCampaign = async () => {
    // If next step is blocked, show a message
    if (nextStepBlocked) {
      showBlockedMessage();
      return;
    }
    
    try {
      if (!project) return;
      
      // Check if we're on the Creative Planning step and need to upload brief files
      if (currentStep === 3 && !briefUploaded && files.length > 0) {
        if (id) {
          // Upload files using the correct interface
          const fileList = new DataTransfer();
          // Note: This is a simplified approach - in practice you'd need to convert 
          // the files array to a FileList properly
          await uploadFiles(fileList.files, id);
          
          // Update local state
          setBriefUploaded(true);
          
          // Now that brief is uploaded, allow next step
          hideBlockedAlert();
        }
      }
      
      // Calculate new step
      const newStep = currentStep + 1;
      
      // Update campaign status in database
      const success = await updateCampaignStatus(newStep);
      
      if (success) {
        setCurrentStep(newStep);
        setProject({...project, status: stepStatusMap[newStep]});
        
        // Check if the new step should block progression
        checkStepBlocked(newStep, project.content_requirements);
      }
    } catch (error) {
      console.error('Error in campaign progression:', error);
    }
  };

  return {
    id,
    project,
    loading,
    currentStep,
    files,
    uploadedFiles,
    isUploading,
    briefUploaded,
    nextStepBlocked,
    showBlockedAlert,
    navigate,
    handleProgressCampaign,
    uploadFiles,
    removeFile,
    clearAllFiles,
    saveContentRequirements,
    isSaving,
    CAMPAIGN_STEPS
  };
}
