
import React, { useState, useEffect, useMemo, memo } from 'react';
import { useParams } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useProjectData } from '@/hooks/useProjectData';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import components
import { CampaignHeader } from '@/components/brand/analytics/CampaignHeader';
import { OverviewTab } from '@/components/brand/analytics/OverviewTab';
import { EngagementTab } from '@/components/brand/analytics/EngagementTab';
import { CreatorsTab } from '@/components/brand/analytics/CreatorsTab';
import { ContentTab } from '@/components/brand/analytics/ContentTab';

const CampaignAnalytics = memo(() => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const { projects, isLoading, error } = useProjectData();
  const { toast } = useToast();

  // Memoize project lookup to prevent unnecessary re-calculations
  const project = useMemo(() => {
    return projects.find(p => p.id === id) || null;
  }, [projects, id]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Could not load project analytics',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Project not found</h2>
            <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </BrandLayout>
    );
  }
  
  return (
    <ErrorBoundary>
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <CampaignHeader projectName={project.name} projectId={project.id} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="creators">Campaign Creators</TabsTrigger>
              <TabsTrigger value="content">Content Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <ErrorBoundary>
                {activeTab === 'overview' && <OverviewTab />}
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <ErrorBoundary>
                {activeTab === 'engagement' && <EngagementTab />}
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="creators" className="space-y-4">
              <ErrorBoundary>
                {activeTab === 'creators' && <CreatorsTab />}
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <ErrorBoundary>
                {activeTab === 'content' && <ContentTab />}
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </BrandLayout>
    </ErrorBoundary>
  );
});

CampaignAnalytics.displayName = 'CampaignAnalytics';

export default CampaignAnalytics;
