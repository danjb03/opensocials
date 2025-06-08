
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useCreateProfileForm } from '@/hooks/useCreateProfileForm';
import { ProfileBasicInfo } from '@/components/creator/ProfileBasicInfo';
import { ContentTypeSelection } from '@/components/creator/ContentTypeSelection';
import { SocialMediaConnection } from '@/components/creator/SocialMediaConnection';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const CreateProfile = () => {
  const navigate = useNavigate();
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
      {/* Navigation Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span>Navigate</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    Home Page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/super-admin')}>
                    Super Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/super-admin/creators')}>
                    Creator Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/brand')}>
                    Brand Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/super-admin/creators')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Creators
            </Button>
          </div>
        </div>
      </div>

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
