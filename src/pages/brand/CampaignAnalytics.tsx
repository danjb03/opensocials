
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import components
import { CampaignHeader } from '@/components/brand/analytics/CampaignHeader';
import { OverviewTab } from '@/components/brand/analytics/OverviewTab';
import { EngagementTab } from '@/components/brand/analytics/EngagementTab';
import { CreatorsTab } from '@/components/brand/analytics/CreatorsTab';
import { ContentTab } from '@/components/brand/analytics/ContentTab';

const CampaignAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
  
  if (loading) {
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
            <OverviewTab />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <EngagementTab />
          </TabsContent>

          <TabsContent value="creators" className="space-y-4">
            <CreatorsTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <ContentTab />
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
};

export default CampaignAnalytics;
