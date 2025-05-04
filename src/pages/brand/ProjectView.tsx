
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Flag, 
  BarChart2,
  ArrowRight, 
  Globe, 
  FileText, 
  CheckCircle, 
  Clock
} from 'lucide-react';
import { statusColors, type ProjectStatus } from '@/types/projects';
import { formatCurrency } from '@/utils/project';

// Campaign progress steps
const CAMPAIGN_STEPS = [
  { id: 'create', label: 'Campaign Created', icon: FileText },
  { id: 'talent', label: 'Talent Matchmaking', icon: Users },
  { id: 'planning', label: 'Creative Planning', icon: Flag },
  { id: 'content', label: 'Content Creation', icon: Calendar },
  { id: 'live', label: 'Campaign Live', icon: Globe },
  { id: 'reporting', label: 'Performance Reporting', icon: BarChart2 },
];

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
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
          'under_review': 2,
          'awaiting_approval': 3,
          'creators_assigned': 3,
          'in_progress': 4,
          'completed': 6
        };
        
        setCurrentStep(statusStepMap[data.status] || 1);
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

  const handleProgressCampaign = async () => {
    try {
      if (!project) return;
      
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
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2">Project not found</h2>
              <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/brand/projects')}>
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    );
  }

  const progressPercentage = (currentStep / CAMPAIGN_STEPS.length) * 100;

  // Calculate timeline data
  const startDate = project.start_date ? new Date(project.start_date) : null;
  const endDate = project.end_date ? new Date(project.end_date) : null;
  
  // Format dates for display
  const formattedStartDate = startDate ? startDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'Not set';
  
  const formattedEndDate = endDate ? endDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'Not set';
  
  // Calculate campaign duration in days if both dates are available
  let campaignDuration = null;
  if (startDate && endDate) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    campaignDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const renderStatus = (status: ProjectStatus) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={colorClass + " text-xs capitalize"}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="flex items-center mt-2 gap-2">
              {renderStatus(project.status as ProjectStatus)}
              <span className="text-gray-500 text-sm">Created on {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/brand/projects')}
            >
              Back to Projects
            </Button>
            {currentStep < CAMPAIGN_STEPS.length && (
              <Button 
                onClick={handleProgressCampaign}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Next Step
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Campaign Progress */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl">Campaign Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              {CAMPAIGN_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index + 1 < currentStep;
                const isCurrent = index + 1 === currentStep;
                
                return (
                  <div key={step.id} className={`flex flex-col items-center p-3 rounded-lg border ${
                    isCompleted ? 'bg-green-50 border-green-200' : 
                    isCurrent ? 'bg-blue-50 border-blue-200' : 
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`rounded-full p-2 mb-2 ${
                      isCompleted ? 'bg-green-100 text-green-600' : 
                      isCurrent ? 'bg-blue-100 text-blue-600' : 
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-center">{step.label}</span>
                    {isCompleted && <CheckCircle className="text-green-500 h-4 w-4 mt-1" />}
                    {isCurrent && <Clock className="text-blue-500 h-4 w-4 mt-1" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Campaign Details */}
          <Card className="md:col-span-2">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium">Campaign Type</div>
                <div className="capitalize">{project.campaign_type.replace('_', ' ')}</div>
              </div>
              
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium">Timeline</div>
                <div>
                  <div>{formattedStartDate} - {formattedEndDate}</div>
                  {campaignDuration && <div className="text-sm text-gray-500">{campaignDuration} days</div>}
                </div>
              </div>
              
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium">Budget</div>
                <div>{formatCurrency(project.budget, project.currency)}</div>
              </div>
              
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium">Platforms</div>
                <div>
                  <div className="flex flex-wrap gap-1">
                    {project.platforms?.map((platform: string) => (
                      <Badge key={platform} variant="outline" className="capitalize">{platform}</Badge>
                    )) || "None specified"}
                  </div>
                </div>
              </div>
              
              {project.content_requirements && (
                <div className="py-4 grid grid-cols-2">
                  <div className="font-medium">Content Requirements</div>
                  <div>
                    {Object.entries(project.content_requirements).map(([type, data]: [string, any]) => (
                      <div key={type} className="capitalize">
                        {type}: {data.quantity} {data.quantity === 1 ? 'item' : 'items'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {project.whitelisting !== undefined && (
                <div className="py-4 grid grid-cols-2">
                  <div className="font-medium">Whitelisting</div>
                  <div>{project.whitelisting ? 'Required' : 'Not required'}</div>
                </div>
              )}
              
              {project.description && (
                <div className="py-4">
                  <div className="font-medium mb-2">Description</div>
                  <div className="text-gray-700">{project.description}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator Assignment & Actions */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-xl">Assigned Creators</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No creators assigned yet</p>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Users className="mr-2 h-4 w-4" /> Find Creators
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>Find Creators for this Campaign</SheetTitle>
                        <SheetDescription>
                          Browse our creator marketplace and connect with the perfect talent for your campaign.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <p className="text-center text-gray-500">
                          Creator matching functionality will be implemented soon.
                        </p>
                        <Button 
                          className="w-full mt-4"
                          onClick={() => navigate('/brand/creator-search')}
                        >
                          Go to Creator Search
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-xl">Campaign Actions</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Campaign
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Manage Budget
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default ProjectView;
