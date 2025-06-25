
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import ErrorBoundary from '@/components/ErrorBoundary';

const ContentUpload = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useUnifiedAuth();
  const [isUploading, setIsUploading] = useState(false);

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
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-white">Content upload functionality preview</p>
            </CardContent>
          </Card>
        </div>
      </CreatorLayout>
    );
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('File uploaded:', file.name);
      // Add actual upload logic here
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Content Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-white mb-2">Drag and drop your content here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,video/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button 
                      className="bg-white text-black hover:bg-gray-200"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

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
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default ContentUpload;
