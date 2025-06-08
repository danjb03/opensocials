
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OrderStage } from '@/types/orders';

export const useProjectActions = (refetch: () => void) => {
  const { toast } = useToast();
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProjectCreated = (newProject: any) => {
    setIsDialogOpen(false);
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully created.`,
    });

    // Force a manual refetch to ensure we see the new project immediately
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const handleStageChange = (stage: OrderStage) => {
    setActiveStage(stage);
    setSelectedProjectId(null);
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProjectId(null);
  };

  const refreshProjects = () => {
    refetch();
  };

  return {
    activeStage,
    selectedProjectId,
    isDialogOpen,
    handleProjectCreated,
    handleStageChange,
    handleProjectSelect,
    handleCloseProjectDetail,
    refreshProjects,
    setIsDialogOpen,
    setSelectedProjectId,
    setActiveStage
  };
};
