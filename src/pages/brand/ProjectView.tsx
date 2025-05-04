
import React from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectHeader } from '@/components/brand/project/ProjectHeader';
import { CampaignProgress } from '@/components/brand/project/CampaignProgress';
import { ProjectDetails } from '@/components/brand/project/ProjectDetails';
import { BriefUploader } from '@/components/brand/project/BriefUploader';
import { AssignedCreators } from '@/components/brand/project/AssignedCreators';
import { CampaignActions } from '@/components/brand/project/CampaignActions';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { ContentRequirements } from '@/types/project';

const ProjectView = () => {
  const {
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
  } = useProjectDetails();
  
  if (loading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2">Project not found</h2>
              <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => navigate('/brand/projects')}
              >
                Back to Projects
              </button>
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    );
  }

  // Extract content requirements with proper type handling
  const contentRequirements = project.content_requirements as ContentRequirements | null;
  const isBriefUploaded = contentRequirements?.brief_uploaded || false;

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <ProjectHeader 
          project={project}
          nextStepBlocked={nextStepBlocked}
          showBlockedAlert={showBlockedAlert}
          isUploading={isUploading}
          currentStep={currentStep}
          totalSteps={CAMPAIGN_STEPS.length}
          onNavigateBack={() => navigate('/brand/projects')}
          onProgressCampaign={handleProgressCampaign}
        />

        <CampaignProgress 
          currentStep={currentStep} 
          campaignSteps={CAMPAIGN_STEPS}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Campaign Details Card */}
          <div className="md:col-span-2 space-y-6">
            <ProjectDetails project={project} />

            {/* Brief Upload Section - only shown when in the right step and not uploaded */}
            {currentStep === 3 && !isBriefUploaded && (
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <BriefUploader
                    nextStepBlocked={nextStepBlocked}
                    handleFileChange={handleFileChange}
                    briefFiles={briefFiles}
                    isUploading={isUploading}
                    handleProgressCampaign={handleProgressCampaign}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <AssignedCreators onNavigateToCreatorSearch={() => navigate('/brand/creator-search')} />
            <CampaignActions
              projectId={id || ''}
              currentStep={currentStep}
              onNavigateTo={navigate}
            />
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default ProjectView;
