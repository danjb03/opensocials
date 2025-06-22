
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import CreatorProfileHeader from '@/components/creator/CreatorProfileHeader';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

const CreatorProfile = () => {
  const { user, role } = useUnifiedAuth();
  const { profile, isLoading, updateProfile } = useCreatorProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading your profile...</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  // Super admin preview mode
  if (role === 'super_admin') {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">Creator Profile</h1>
            <p className="text-muted-foreground">You are viewing the creator profile page as a super admin.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-white text-center">Create a creator profile to see the full profile experience.</p>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  const handleProfileSubmit = async (values: any) => {
    try {
      await updateProfile(values);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isEditing) {
    return (
      <ErrorBoundary>
        <CreatorLayout>
          <div className="container mx-auto p-6 bg-background">
            <ProfileEditForm
              profile={profile}
              isLoading={false}
              onSubmit={handleProfileSubmit}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </CreatorLayout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <CreatorLayout>
        <div className="container mx-auto p-6 bg-background">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your creator profile and social media connections.
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <ErrorBoundary fallback={() => (
            <div className="bg-card rounded-lg p-6 border border-border">
              <p className="text-white text-center">Profile display temporarily unavailable</p>
            </div>
          )}>
            <CreatorProfileHeader profile={profile} />
          </ErrorBoundary>
        </div>
      </CreatorLayout>
    </ErrorBoundary>
  );
};

export default CreatorProfile;
