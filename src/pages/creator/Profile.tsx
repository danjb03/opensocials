
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

const ProfileDisplay = React.memo(({ profile }: { profile: any }) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <div className="flex items-center space-x-4 mb-4">
      {profile.avatarUrl && (
        <img 
          src={profile.avatarUrl} 
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div>
        <h2 className="text-xl font-semibold text-white">
          {profile.firstName} {profile.lastName}
        </h2>
        {profile.bio && (
          <p className="text-muted-foreground">{profile.bio}</p>
        )}
      </div>
    </div>
    
    {profile.primaryPlatform && (
      <div className="mb-2">
        <span className="text-sm font-medium text-white">Primary Platform: </span>
        <span className="text-muted-foreground">{profile.primaryPlatform}</span>
      </div>
    )}
    
    {profile.industries && profile.industries.length > 0 && (
      <div className="mb-2">
        <span className="text-sm font-medium text-white">Industries: </span>
        <span className="text-muted-foreground">{profile.industries.join(', ')}</span>
      </div>
    )}
  </div>
));

ProfileDisplay.displayName = 'ProfileDisplay';

const CreatorProfile = () => {
  const { user, role } = useUnifiedAuth();
  const { profile, isLoading } = useCreatorProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileSubmit = React.useCallback(async (values: any) => {
    try {
      console.log('Profile update values:', values);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, []);

  const handleEditClick = React.useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = React.useCallback(() => {
    setIsEditing(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Super admin preview mode
  if (role === 'super_admin') {
    return (
      <div className="container mx-auto p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-white">Creator Profile</h1>
          <p className="text-muted-foreground">You are viewing the creator profile page as a super admin.</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-white text-center">Create a creator profile to see the full profile experience.</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto p-6 bg-background">
          <ProfileEditForm
            profile={profile}
            isLoading={false}
            onSubmit={handleProfileSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 bg-background">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your creator profile and social media connections.
            </p>
          </div>
          <Button
            onClick={handleEditClick}
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
          {profile && <ProfileDisplay profile={profile} />}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default CreatorProfile;
