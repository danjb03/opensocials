
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import ErrorBoundary from '@/components/ErrorBoundary';
import ContentUploader from '@/components/creator/campaigns/ContentUploader';
import { useSubmitContent } from '@/hooks/useCampaignSubmissions';
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
import { supabase } from '@/integrations/supabase/client';

const ContentUpload = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useUnifiedAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [hashtagsText, setHashtagsText] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | ''>('');

  const submitContent = useSubmitContent();

  // Fetch campaign/project details for header information
  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects_new') // adjust to correct table if needed
        .select('name, description')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Super-admin preview mode
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
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
              Upload your content for campaign: {id}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- left column : uploader and previews --- */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Content Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContentUploader onFilesSelected={handleFilesSelected} />

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
              disabled={submitContent.isPending}
              className="bg-primary text-white"
            >
              {submitContent.isPending ? 'Submitting…' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default ContentUpload;
