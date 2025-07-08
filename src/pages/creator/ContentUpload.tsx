import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Image, Video, FileText } from 'lucide-react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import ErrorBoundary from '@/components/ErrorBoundary';

const ContentUpload = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useUnifiedAuth();
  const [isUploading, setIsUploading] = useState(false);

  if (role === 'super_admin') {
    return (
      <CreatorLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-12 max-w-6xl">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/creator/campaigns')} 
              className="mb-8 text-foreground hover:text-foreground hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
            
            <div className="mb-12">
              <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
                Content Upload
              </h1>
              <p className="text-lg text-muted-foreground font-light">
                You are viewing the content upload page as a super admin.
              </p>
            </div>
            
            <Card className="border-border bg-card/30">
              <CardContent className="p-12 text-center">
                <Upload className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-medium text-foreground mb-2">Content Upload Preview</h3>
                <p className="text-muted-foreground">Preview mode - actual upload functionality would be available for creators</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('File uploaded:', file.name);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ErrorBoundary>
      <CreatorLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-12 max-w-6xl">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/creator/campaigns')} 
              className="mb-8 text-foreground hover:text-foreground hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
            
            <div className="mb-12">
              <h1 className="text-4xl font-light text-foreground tracking-tight mb-3">
                Upload Content
              </h1>
              <p className="text-lg text-muted-foreground font-light">
                Upload your content for campaign: {id}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-border bg-card/30">
                <CardHeader className="pb-6">
                  <CardTitle className="text-foreground text-xl font-medium">Content Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-muted-foreground/50 transition-colors">
                    <Upload className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                    <h3 className="text-foreground text-lg font-medium mb-2">Drag and drop your content here</h3>
                    <p className="text-sm text-muted-foreground mb-6">or click to browse files</p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,video/*"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button 
                        className="bg-foreground text-background hover:bg-foreground/90"
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Choose File'}
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30">
                <CardHeader className="pb-6">
                  <CardTitle className="text-foreground text-xl font-medium">Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">File Size</p>
                        <p className="text-xs text-muted-foreground">Maximum 100MB per file</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Image Formats</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, GIF - High resolution recommended</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Video Formats</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV, AVI - 1080p or higher preferred</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-2">Content Requirements</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Follow brand guidelines and campaign brief</li>
                      <li>• Include required hashtags and mentions</li>
                      <li>• Ensure content meets platform specifications</li>
                      <li>• Add captions or descriptions if specified</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default ContentUpload;
