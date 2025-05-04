
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectStatus } from '@/types/projects';
import { ContentRequirements } from '@/types/project';

// Campaign progress steps
export const CAMPAIGN_STEPS = [
  { id: 'create', label: 'Campaign Created', icon: 'FileText' },
  { id: 'talent', label: 'Talent Matchmaking', icon: 'Users' },
  { id: 'planning', label: 'Creative Planning', icon: 'Flag' },
  { id: 'content', label: 'Content Creation', icon: 'Calendar' },
  { id: 'live', label: 'Campaign Live', icon: 'Globe' },
  { id: 'reporting', label: 'Performance Reporting', icon: 'BarChart2' },
];

export function useProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [briefFiles, setBriefFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [briefUploaded, setBriefUploaded] = useState(false);
  const [nextStepBlocked, setNextStepBlocked] = useState(false);
  const [showBlockedAlert, setShowBlockedAlert] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        
        // Determine current step based on status
        const statusStepMap: Record<string, number> = {
          'draft': 1,
          'new': 1,
          'under_review': 2,
          'awaiting_approval': 3,
          'creators_assigned': 3,
          'in_progress': 4,
          'completed': 6
        };
        
        // Check for metadata containing brief upload info using type checking
        const contentReqs = data.content_requirements as ContentRequirements | null;
        setBriefUploaded(contentReqs?.brief_uploaded || false);
        
        const step = statusStepMap[data.status] || 1;
        setCurrentStep(step);
        
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
  }, [id, toast]);

  // Function to check if the current step should block progression
  const checkStepBlocked = (step: number, contentReqs: ContentRequirements | null) => {
    // Block "Next Step" when on Creative Planning without brief upload
    if (step === 3 && !(contentReqs?.brief_uploaded)) {
      setNextStepBlocked(true);
    } else {
      setNextStepBlocked(false);
    }
  };

  const handleProgressCampaign = async () => {
    if (nextStepBlocked) {
      setShowBlockedAlert(true);
      toast({
        title: 'Action Required',
        description: 'You must upload a brief before proceeding to the next step.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (!project) return;
      
      // Check if we're on the Creative Planning step and need to upload brief files
      if (currentStep === 3 && !briefUploaded && briefFiles.length > 0) {
        setIsUploading(true);
        try {
          // This would be an actual file upload to Supabase storage
          // For now we'll just simulate it
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Store brief upload info in content_requirements object
          const updatedContentRequirements: ContentRequirements = {
            ...(project.content_requirements as ContentRequirements || {}),
            brief_uploaded: true,
            brief_files: briefFiles.map(file => file.name)
          };
          
          // Update project record with brief_uploaded flag in content_requirements
          const { error: updateError } = await supabase
            .from('projects')
            .update({ content_requirements: updatedContentRequirements })
            .eq('id', id);
            
          if (updateError) throw updateError;
          
          // Update local state
          setBriefUploaded(true);
          setProject({
            ...project, 
            content_requirements: updatedContentRequirements
          });
          
          toast({
            title: 'Brief Uploaded',
            description: 'Campaign brief and materials have been uploaded successfully',
          });
          
          // Now that brief is uploaded, allow next step
          setNextStepBlocked(false);
        } catch (error) {
          console.error('Error uploading files:', error);
          toast({
            title: 'Upload Error',
            description: 'Failed to upload campaign materials',
            variant: 'destructive',
          });
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }
      
      let newStatus: ProjectStatus = 'new';
      let newStep = currentStep + 1;
      
      // Map step to status
      if (newStep === 2) newStatus = 'under_review';
      else if (newStep === 3) newStatus = 'awaiting_approval';
      else if (newStep === 4) newStatus = 'creators_assigned';
      else if (newStep === 5) newStatus = 'in_progress';
      else if (newStep === 6) newStatus = 'completed';
      
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setCurrentStep(newStep);
      setProject({...project, status: newStatus});
      
      // Check if the new step should block progression
      checkStepBlocked(newStep, project.content_requirements as ContentRequirements | null);
      
      toast({
        title: 'Campaign Updated',
        description: `Campaign moved to ${CAMPAIGN_STEPS[newStep-1].label}`,
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Could not update campaign status',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBriefFiles(Array.from(e.target.files));
      setShowBlockedAlert(false);
    }
  };

  return {
    id,
    project,
    loading,
    currentStep,
    briefFiles,
    isUploading,
    briefUploaded,
    nextStepBlocked,
    showBlockedAlert,
    navigate,
    handleProgressCampaign,
    handleFileChange,
    CAMPAIGN_STEPS
  };
}
