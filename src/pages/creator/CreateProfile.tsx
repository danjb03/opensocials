
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreateProfileForm } from '@/hooks/useCreateProfileForm';
import { ProfileBasicInfo } from '@/components/creator/ProfileBasicInfo';
import { ContentTypeSelection } from '@/components/creator/ContentTypeSelection';
import { SocialMediaConnection } from '@/components/creator/SocialMediaConnection';

const CreateProfile = () => {
  const {
    formData,
    isLoading,
    handleInputChange,
    handleContentTypeToggle,
    handleSubmit
  } = useCreateProfileForm();

  const handleConnectionSuccess = () => {
    console.log('Social media connection successful from CreateProfile');
    // Optionally refresh profile data or show success message
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Creator Profile</h1>
          <p className="text-muted-foreground">Tell brands about yourself and your content</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Fill out your profile details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProfileBasicInfo 
                formData={formData}
                onInputChange={handleInputChange}
              />

              <ContentTypeSelection 
                selectedTypes={formData.contentTypes}
                onContentTypeToggle={handleContentTypeToggle}
              />

              <SocialMediaConnection onConnectionSuccess={handleConnectionSuccess} />
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="min-w-32">
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;
