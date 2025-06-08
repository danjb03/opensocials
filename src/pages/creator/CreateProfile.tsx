
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
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Create Your Creator Profile</h1>
            <p className="text-muted-foreground text-lg">Tell brands about yourself and your content</p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Basic Information</CardTitle>
              <CardDescription className="text-base">
                Fill out your profile details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <ProfileBasicInfo 
                  formData={formData}
                  onInputChange={handleInputChange}
                />

                <ContentTypeSelection 
                  selectedTypes={formData.contentTypes}
                  onContentTypeToggle={handleContentTypeToggle}
                />

                <SocialMediaConnection onConnectionSuccess={handleConnectionSuccess} />
                
                <div className="pt-6 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="min-w-40 py-3 text-lg">
                    {isLoading ? 'Creating...' : 'Create Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
