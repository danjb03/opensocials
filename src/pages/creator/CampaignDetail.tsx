
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/project';
import { ArrowLeft, Calendar, Clock, Upload, FileText, Eye, Instagram, Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  contentRequirements: Record<string, any>;
  brandId: string;
  platforms: string[];
  dealId: string;
  value: number;
  deadline: string;
  brandName: string;
  brandLogo: string | null;
  uploads: any[];
}

// Interface for Supabase project data
interface ProjectData {
  id?: string;
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  content_requirements?: Record<string, any>;
  brand_id?: string;
  platforms?: string[];
  submission_deadline?: string;
}

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      try {
        if (!user?.id) throw new Error('User not authenticated');
        
        // Get deal first to identify campaign the creator is involved in
        const { data: deals, error: dealsError } = await supabase
          .from('deals')
          .select('*')
          .eq('creator_id', user.id)
          .eq('status', 'accepted');
        
        if (dealsError) throw dealsError;
        
        if (!deals || deals.length === 0) {
          throw new Error('No deals found');
        }

        // Find the relevant deal
        const deal = deals.find(d => d.id === id);
        
        if (!deal) {
          throw new Error('Campaign not found');
        }

        // Now fetch the project associated with this deal
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (projectError) {
          console.warn('Could not find project, using deal data instead:', projectError);
        }

        // Initialize campaign with combined data
        const campaignData: Campaign = {
          id: (project?.id || deal.id || ''),
          title: (project?.name || deal.title || 'Untitled Campaign'),
          description: (project?.description || deal.description || ''),
          startDate: (project?.start_date || new Date().toISOString()),
          endDate: (project?.end_date || new Date().toISOString()),
          status: (project?.status || 'in_progress'),
          contentRequirements: (project?.content_requirements || {}),
          brandId: (project?.brand_id || deal.brand_id || ''),
          platforms: (project?.platforms || []),
          dealId: deal.id,
          value: deal.value || 0,
          deadline: (project?.submission_deadline || project?.end_date || new Date().toISOString()),
          brandName: '',
          brandLogo: null,
          uploads: []
        };

        // Get brand info if brandId is available
        if (campaignData.brandId) {
          const { data: brandData } = await supabase
            .from('profiles')
            .select('company_name, logo_url')
            .eq('id', campaignData.brandId)
            .single();
          
          if (brandData) {
            campaignData.brandName = brandData?.company_name || 'Unknown Brand';
            campaignData.brandLogo = brandData?.logo_url;
          }
        }
        
        // Get upload history
        if (id) {
          const { data: contentData } = await supabase
            .from('campaign_content')
            .select('*')
            .eq('campaign_id', campaignData.id)
            .eq('creator_id', user.id);
          
          campaignData.uploads = contentData || [];
        }
        
        return campaignData;
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast.error('Failed to load campaign details');
        return null;
      }
    },
    enabled: !!id && !!user?.id,
  });

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CreatorLayout>
    );
  }

  if (!campaign) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/creator/campaigns')} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The campaign you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => navigate('/creator/campaigns')}>View All Campaigns</Button>
            </CardContent>
          </Card>
        </div>
      </CreatorLayout>
    );
  }

  const today = new Date();
  const startDate = parseISO(campaign.startDate);
  const endDate = parseISO(campaign.endDate);
  const deadlineDate = campaign.deadline ? parseISO(campaign.deadline) : endDate;
  
  const isActive = isBefore(startDate, today) && isAfter(endDate, today);
  const isUpcoming = isAfter(startDate, today);
  const isCompleted = isBefore(endDate, today) || campaign.status === 'completed';
  
  const getCampaignStatus = () => {
    if (isCompleted) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (isUpcoming) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Calendar className="h-3 w-3 mr-1" />
          Starts {format(startDate, 'MMM d')}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <Clock className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'tiktok':
        return <TikTokIcon className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/creator/campaigns')} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  {getCampaignStatus()}
                  
                  <div className="flex gap-2">
                    {campaign.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {getPlatformIcon(platform)}
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10 rounded-md">
                    {campaign.brandLogo ? (
                      <AvatarImage src={campaign.brandLogo} alt={campaign.brandName} />
                    ) : (
                      <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                        {campaign.brandName?.substring(0, 2) || 'BR'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                    <CardDescription className="text-base">{campaign.brandName}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="uploads">Uploads</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <h3 className="text-lg font-medium">About this Campaign</h3>
                      <p className="text-muted-foreground">
                        {campaign.description || 'No description provided for this campaign.'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="font-medium text-sm text-muted-foreground mb-1">Timeline</div>
                          <div className="font-medium">
                            {format(parseISO(campaign.startDate), 'MMM d')} - {format(parseISO(campaign.endDate), 'MMM d, yyyy')}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="font-medium text-sm text-muted-foreground mb-1">Payment</div>
                          <div className="font-medium">{formatCurrency(campaign.value)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="font-medium text-sm text-muted-foreground mb-1">Content Deadline</div>
                          <div className="font-medium">
                            {format(deadlineDate, 'MMM d, yyyy')}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="font-medium text-sm text-muted-foreground mb-1">Content Pieces</div>
                          <div className="font-medium">
                            {Object.entries(campaign.contentRequirements || {}).reduce(
                              (total, [_, value]: [string, any]) => total + (value?.quantity || 0), 
                              0
                            ) || 'Not specified'}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <h3 className="text-lg font-medium">Content Requirements</h3>
                      
                      {Object.keys(campaign.contentRequirements || {}).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {Object.entries(campaign.contentRequirements).map(([contentType, details]: [string, any]) => (
                            <Card key={contentType}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">{contentType.charAt(0).toUpperCase() + contentType.slice(1)}</CardTitle>
                                <CardDescription>Quantity: {details.quantity || 0}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {details.description || `Create ${details.quantity || 'some'} ${contentType} content for this campaign.`}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No specific content requirements provided for this campaign.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="uploads" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Your Uploads</h3>
                      
                      {!isCompleted && (
                        <Button onClick={() => navigate(`/creator/campaigns/${id}/upload`)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New Content
                        </Button>
                      )}
                    </div>
                    
                    {campaign.uploads && campaign.uploads.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {campaign.uploads.map((upload: any) => (
                          <Card key={upload.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded">
                                  <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{upload.title || 'Uploaded Content'}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Uploaded {format(new Date(upload.created_at), 'MMM d, yyyy')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={upload.status === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : upload.status === 'rejected' 
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {upload.status === 'approved' 
                                    ? 'Approved' 
                                    : upload.status === 'rejected' 
                                    ? 'Needs Revision'
                                    : 'Under Review'}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium mb-1">No Uploads Yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            You haven't uploaded any content for this campaign yet.
                          </p>
                          {!isCompleted && (
                            <Button onClick={() => navigate(`/creator/campaigns/${id}/upload`)}>
                              Upload Content
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isAfter(today, startDate) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Campaign Start</div>
                    <div className="text-xs text-muted-foreground">{format(startDate, 'MMMM d, yyyy')}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isAfter(today, deadlineDate) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Upload className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Content Deadline</div>
                    <div className="text-xs text-muted-foreground">{format(deadlineDate, 'MMMM d, yyyy')}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isAfter(today, endDate) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Campaign End</div>
                    <div className="text-xs text-muted-foreground">{format(endDate, 'MMMM d, yyyy')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => navigate(`/creator/campaigns/${id}/upload`)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:support@example.com?subject=Question about campaign ${campaign.title}`)}>
                  Contact Support
                </Button>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Need help with this campaign? Contact support for assistance.
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CampaignDetail;
