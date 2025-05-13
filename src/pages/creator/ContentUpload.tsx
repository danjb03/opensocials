import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileUp, Loader2, Upload, X } from 'lucide-react';
import ContentUploader from '@/components/creator/campaigns/ContentUploader';

interface Campaign {
  id: string;
  title: string;
  contentRequirements: Record<string, any>;
  brandId: string;
  platforms: string[];
  dealId: string;
  brandName: string;
}

const ContentUpload = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('');
  const [platform, setPlatform] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-upload', id],
    queryFn: async () => {
      try {
        // Get deal first to identify campaign the creator is involved in
        const { data: deals, error: dealsError } = await supabase
          .from('deals')
          .select('*, projects:brand_id(*)')
          .eq('creator_id', user?.id)
          .eq('status', 'accepted');
        
        if (dealsError) throw dealsError;

        const deal = deals.find(d => d.projects?.id === id || d.id === id);
        
        if (!deal) {
          throw new Error('Campaign not found');
        }

        const campaignData: Campaign = {
          id: deal.projects?.id || deal.id,
          title: deal.projects?.name || deal.title,
          contentRequirements: deal.projects?.content_requirements || {},
          brandId: deal.projects?.brand_id || deal.brand_id,
          platforms: deal.projects?.platforms || [],
          dealId: deal.id,
          brandName: ''
        };

        // Get brand info
        const { data: brandData } = await supabase
          .from('profiles')
          .select('company_name, logo_url')
          .eq('id', campaignData.brandId)
          .single();
        
        if (brandData) {
          campaignData.brandName = brandData?.company_name || 'Unknown Brand';
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

  useEffect(() => {
    // Set platform to first platform if available
    if (campaign?.platforms?.length) {
      setPlatform(campaign.platforms[0]);
    }
    
    // Set content type to first type if available
    if (campaign?.contentRequirements) {
      const contentTypes = Object.keys(campaign.contentRequirements);
      if (contentTypes.length) {
        setContentType(contentTypes[0]);
      }
    }
  }, [campaign]);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Please enter a title for your submission');
      return;
    }
    
    if (!contentType) {
      toast.error('Please select a content type');
      return;
    }
    
    if (!platform) {
      toast.error('Please select a platform');
      return;
    }
    
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, insert the content record
      const { data: contentData, error: contentError } = await supabase
        .from('campaign_content')
        .insert({
          campaign_id: id,
          creator_id: user?.id,
          title,
          description,
          content_type: contentType,
          platform,
          status: 'pending',
        })
        .select();
      
      if (contentError) throw contentError;
      
      const contentId = contentData[0].id;
      
      // Then upload each file
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${contentId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('campaign-content')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        // Get the URL of the uploaded file
        const { data: fileData } = supabase
          .storage
          .from('campaign-content')
          .getPublicUrl(fileName);
        
        // Link the file to the content record
        await supabase
          .from('campaign_content_files')
          .insert({
            content_id: contentId,
            file_path: fileName,
            file_url: fileData.publicUrl,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
          });
      }
      
      toast.success('Content uploaded successfully');
      navigate(`/creator/campaigns/${id}`);
    } catch (error) {
      console.error('Error uploading content:', error);
      toast.error('Failed to upload content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="text-3xl mb-4">😕</div>
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

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/creator/campaigns/${id}`)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaign
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Content for {campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter a title for your content" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select 
                        value={contentType} 
                        onValueChange={setContentType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {campaign.contentRequirements && Object.keys(campaign.contentRequirements).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select 
                        value={platform} 
                        onValueChange={setPlatform}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {campaign.platforms.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Add details about your content"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Files</Label>
                    <ContentUploader onFilesSelected={handleFileChange} />
                    
                    {files.length > 0 && (
                      <div className="mt-4 border rounded-md p-2">
                        <p className="text-sm font-medium mb-2">Selected Files:</p>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                              <div className="flex items-center">
                                <FileUp className="h-4 w-4 mr-2" />
                                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button 
                                type="button"
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6" 
                                onClick={() => handleRemoveFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/creator/campaigns/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || files.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Content
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Content Requirements</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {campaign.contentRequirements && Object.entries(campaign.contentRequirements).map(([type, details]: [string, any]) => (
                      <li key={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}: {details.quantity || 0} {details.quantity === 1 ? 'piece' : 'pieces'}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">File Requirements</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Maximum file size: 100MB per file</li>
                    <li>Accepted formats: MP4, JPG, PNG</li>
                    <li>Video aspect ratio: 9:16 or 16:9</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Tips for Success</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Follow the brand guidelines provided</li>
                    <li>Ensure good lighting and sound quality</li>
                    <li>Double-check your file meets all requirements</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Note: All content submitted is subject to brand approval. You may be asked to make revisions before final approval.
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default ContentUpload;
