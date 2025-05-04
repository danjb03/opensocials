import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Clock,
  Upload,
  FilePlus,
  FileCheck,
  AlertCircle
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

// Type for the content requirements to ensure proper typing
interface ContentRequirements {
  videos?: { quantity: number };
  stories?: { quantity: number };
  posts?: { quantity: number };
  brief_uploaded?: boolean;
  brief_files?: string[];
  [key: string]: any; // Add index signature to make it compatible with Json type
}

const ProjectView = () => {
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

  // Extract content requirements with proper type handling
  const contentRequirements = project.content_requirements as ContentRequirements | null;
  const isBriefUploaded = contentRequirements?.brief_uploaded || false;
  const briefFilesList = contentRequirements?.brief_files || [];

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <div className="flex items-center gap-2">
              {renderStatus(project.status as ProjectStatus)}
              <span className="text-gray-500 text-sm">Created on {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/brand/projects')}
              className="shadow-sm"
            >
              Back to Projects
            </Button>
            {currentStep < CAMPAIGN_STEPS.length && (
              <Button 
                onClick={handleProgressCampaign}
                disabled={isUploading || nextStepBlocked}
                className={`${nextStepBlocked ? 'bg-gray-400 hover:bg-gray-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} shadow-sm`}
              >
                {isUploading ? 'Uploading...' : 'Next Step'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Show blocked alert */}
        {showBlockedAlert && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must upload a brief and contract before proceeding to the next step.
            </AlertDescription>
          </Alert>
        )}

        {/* Campaign Progress */}
        <Card className="mb-8 overflow-hidden shadow-sm">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl">Campaign Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4 border rounded-lg p-4 bg-white shadow-sm">
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
                  } shadow-sm`}>
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
          <Card className="md:col-span-2 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-xl">Campaign Details</CardTitle>
              <CardDescription>Complete information about this campaign</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium text-gray-700">Campaign Type</div>
                <div className="capitalize font-medium">{project.campaign_type.replace('_', ' ')}</div>
              </div>
              
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium text-gray-700">Timeline</div>
                <div>
                  <div className="font-medium">{formattedStartDate} - {formattedEndDate}</div>
                  {campaignDuration && <div className="text-sm text-blue-600 mt-1">{campaignDuration} days duration</div>}
                </div>
              </div>
              
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium text-gray-700">Budget</div>
                <div className="font-medium">{formatCurrency(project.budget, project.currency)}</div>
              </div>
              
              <div className="py-4 grid grid-cols-2">
                <div className="font-medium text-gray-700">Platforms</div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {project.platforms?.map((platform: string) => (
                      <Badge key={platform} variant="outline" className="capitalize shadow-sm bg-blue-50">{platform}</Badge>
                    )) || "None specified"}
                  </div>
                </div>
              </div>
              
              {contentRequirements && (
                <div className="py-4 grid grid-cols-2">
                  <div className="font-medium text-gray-700">Content Requirements</div>
                  <div className="space-y-2">
                    {Object.entries(contentRequirements).map(([type, data]: [string, any]) => {
                      if (type === 'brief_uploaded' || type === 'brief_files') return null;
                      return (
                        <div key={type} className="flex items-center gap-2">
                          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                          <span>{data.quantity} {data.quantity === 1 ? 'item' : 'items'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {project.whitelisting !== undefined && (
                <div className="py-4 grid grid-cols-2">
                  <div className="font-medium text-gray-700">Whitelisting</div>
                  <div>{project.whitelisting ? 
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Required</Badge> : 
                    <Badge variant="outline" className="bg-gray-50">Not required</Badge>}
                  </div>
                </div>
              )}
              
              {project.description && (
                <div className="py-4">
                  <div className="font-medium text-gray-700 mb-2">Description</div>
                  <div className="text-gray-700 bg-gray-50 p-4 rounded-md border">
                    {project.description}
                  </div>
                </div>
              )}

              {/* Brief & Contract Upload Section */}
              {currentStep === 3 && !isBriefUploaded && (
                <div className="py-4">
                  <div className="font-medium text-gray-700 mb-2">Campaign Brief & Contract</div>
                  <div className={`${nextStepBlocked ? 'bg-red-50 border-red-200' : 'bg-gray-50'} border-2 border-dashed rounded-lg p-6 mt-2 flex flex-col items-center transition-colors duration-200`}>
                    <div className="mb-4 flex flex-col items-center">
                      <Upload className={`h-12 w-12 ${nextStepBlocked ? 'text-red-400' : 'text-gray-400'} mb-3`} />
                      <p className="font-medium text-gray-700">Upload Campaign Brief & Contract</p>
                      <p className="text-sm text-gray-500 mt-1 text-center">
                        {nextStepBlocked ? 
                          'You must upload your campaign brief before proceeding to the next step' : 
                          'Upload your campaign brief, contract, and any other relevant documents for approval'}
                      </p>
                    </div>
                    
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center shadow-sm">
                        <FilePlus className="mr-2 h-4 w-4" />
                        Select Files
                      </div>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>

                    {briefFiles.length > 0 && (
                      <div className="mt-4 w-full">
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                        <div className="space-y-2">
                          {briefFiles.map((file, index) => (
                            <div key={index} className="flex items-center bg-white p-2 rounded border shadow-sm">
                              <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm truncate">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({Math.round(file.size / 1024)} KB)
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          onClick={handleProgressCampaign} 
                          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : 'Upload Files & Continue'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Show uploaded brief files if already uploaded */}
              {isBriefUploaded && briefFilesList.length > 0 && (
                <div className="py-4">
                  <div className="font-medium text-gray-700 mb-2">Uploaded Campaign Materials</div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium text-green-700">Brief and contract uploaded</span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Files:</p>
                      <div className="space-y-1 bg-white p-3 rounded-md border">
                        {briefFilesList.map((fileName: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{fileName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator Assignment & Actions */}
          <div className="space-y-8">
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-xl">Assigned Creators</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No creators assigned yet</p>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm">
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
                          className="w-full mt-4 shadow-sm"
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

            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-xl">Campaign Actions</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start shadow-sm transition-colors hover:bg-blue-50"
                    onClick={() => navigate(`/brand/projects/edit/${id}`)}
                  >
                    <FileText className="mr-2 h-4 w-4 text-blue-600" />
                    Edit Campaign
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start shadow-sm transition-colors hover:bg-blue-50"
                    onClick={() => navigate(`/brand/projects/budget/${id}`)}
                  >
                    <DollarSign className="mr-2 h-4 w-4 text-indigo-600" />
                    Manage Budget
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start shadow-sm transition-colors hover:bg-blue-50"
                    onClick={() => navigate(`/brand/projects/analytics/${id}`)}
                    disabled={currentStep < 6} // Only active in Performance Reporting stage
                  >
                    <BarChart2 className="mr-2 h-4 w-4 text-green-600" />
                    View Analytics
                    {currentStep < 6 && (
                      <Badge className="ml-2 bg-gray-100 text-gray-500">Available in final stage</Badge>
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-3 border-t">
                <p className="text-xs text-gray-500 w-full text-center">
                  Additional actions will be available as the campaign progresses
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default ProjectView;
