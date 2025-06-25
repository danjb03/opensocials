import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import ErrorBoundary from '@/components/ErrorBoundary';
import SafeContentUploader from '@/components/creator/campaigns/SafeContentUploader';
import { useSafeSubmitContent } from '@/hooks/useSafeCampaignSubmissions';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseReady } from '@/integrations/supabase/safe-client';
import { ClientOnly, SupabaseReady } from '@/components/safe-components';

const SafeContentUpload = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useUnifiedAuth();
  
  // Client-side rendering check
  const [isClient, setIsClient] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Form state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [hashtagsText, setHashtagsText] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | ''>('');

  // Safe hooks
  const submitContent = useSafeSubmitContent();

  // Check if we're in a browser environment after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe campaign data fetching
  const { data: campaign, isLoading: campaignLoading, error: campaignError, refetch } = useQuery({
    queryKey: ['campaign', id, retryCount],
    enabled: !!id && isClient && isSupabaseReady(),
    queryFn: async () => {
      if (!isSupabaseReady()) {
        throw new Error('Supabase client is not available');
      }
      
      const { data, error } = await supabase
        .from('projects_new') // adjust to correct table if needed
        .select('name, description')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  // Handle retry when there's an error
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  // Super admin preview mode
  if (role === 'super_admin') {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/creator/campaigns')} 
            className="mb-6 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">Content Upload</h1>
            <p className="text-muted-foreground">You are viewing the content upload page as a super admin.</p>
          </div>
          
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-white">Content upload functionality preview</p>
            </CardContent>
          </Card>
        </div>
      </CreatorLayout>
    );
  }

  /* -------- helpers -------- */
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    if (!id) return;
    if (selectedFiles.length === 0) {
      toast.error('Please add at least one file.');
      return;
    }
    if (!platform) {
      toast.error('Select a platform.');
      return;
    }

    try {
      const hashtags =
        hashtagsText
          .split(',')
          .map((h) => h.trim())
          .filter(Boolean) || [];

      // NOTE: real file-uploading to storage should happen here.
      // For now we only pass meta information so the backend record is created.
      const filesMeta = selectedFiles.map((f) => ({
        name: f.name,
        type: f.type.startsWith('image') ? 'image' : 'video',
        size: f.size,
      }));

      await submitContent.mutateAsync({
        campaignId: id,
        contentData: {
          caption,
          hashtags,
          platform,
          files: filesMeta,
        },
      });

      toast.success('Content submitted for review.');
      navigate('/creator/campaigns');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit content.');
    }
  };

  // Show loading state during SSR
  if (!isClient) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </CreatorLayout>
    );
  }

  // Show error state if Supabase isn't ready
  if (isClient && !isSupabaseReady()) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/creator/campaigns')} 
            className="mb-6 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Service Unavailable</h3>
              <p className="text-muted-foreground mb-4">The content upload system is currently unavailable.</p>
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </CreatorLayout>
    );
  }

  // Show loading state while fetching campaign data
  if (campaignLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/creator/campaigns')} 
            className="mb-6 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">Upload Content</h1>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-48"></div>
          </div>
          
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </CreatorLayout>
    );
  }

  // Show error state if campaign data fetch failed
  if (campaignError) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/creator/campaigns')} 
            className="mb-6 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Error Loading Campaign</h3>
              <p className="text-muted-foreground mb-4">
                {campaignError instanceof Error ? campaignError.message : 'Failed to load campaign details.'}
              </p>
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <ErrorBoundary>
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/creator/campaigns')} 
            className="mb-6 text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">Upload Content</h1>
            <p className="text-muted-foreground">
              Upload your content for campaign: {campaign?.name || id}
            </p>
          </div>

          <ClientOnly>
            <SupabaseReady>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- left column : uploader and previews --- */}
                <div className="space-y-6 lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-white">Content Files</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <SafeContentUploader onFilesSelected={handleFilesSelected} />

                      {selectedFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedFiles.map((file, idx) => {
                            const previewUrl = URL.createObjectURL(file);
                            return (
                              <div key={idx} className="relative">
                                <img
                                  src={previewUrl}
                                  alt={file.name}
                                  className="h-32 w-full object-cover rounded-lg"
                                />
                                <span className="absolute bottom-1 right-1 text-xs bg-black/60 text-white px-1 rounded">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-white">Content Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Caption</label>
                        <Textarea
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="Write a compelling caption…"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Hashtags (comma separated)</label>
                        <Input
                          value={hashtagsText}
                          onChange={(e) => setHashtagsText(e.target.value)}
                          placeholder="#brand, #campaign"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Platform</label>
                        <Select value={platform} onValueChange={(v) => setPlatform(v as any)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-white">Upload Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Maximum file size: 100MB</li>
                      <li>• Supported formats: JPG, PNG, MP4, MOV</li>
                      <li>• High resolution recommended</li>
                      <li>• Include captions if required</li>
                      <li>• Follow brand guidelines</li>
                      <li>• After approval you will be prompted to post and add the live link</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={submitContent.isPending || !isSupabaseReady()}
                  className="bg-primary text-white"
                >
                  {submitContent.isPending ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    'Submit for Review'
                  )}
                </Button>
              </div>
            </SupabaseReady>
          </ClientOnly>
        </div>
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default SafeContentUpload;
