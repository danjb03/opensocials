
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

const CreatorProfile = () => {
  const { user, role } = useUnifiedAuth();
  const { profile, isLoading } = useCreatorProfile();
  const [isEditing, setIsEditing] = useState(false);

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

  const handleProfileSubmit = async (values: any) => {
    try {
      // For now, just log the submission since updateProfile isn't available
      console.log('Profile update values:', values);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isEditing) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto p-6 bg-background">
          <ProfileEditForm
            profile={profile}
            isLoading={false}
            onSubmit={handleProfileSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cover + Avatar */}
        {profile && (
          <section className="relative bg-muted/20 rounded-lg overflow-hidden h-56 md:h-64">
            {/* Cover image placeholder */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40" />
            {/* Avatar */}
            <div className="absolute -bottom-10 left-6 flex items-end space-x-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-4 border-background object-cover shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center text-4xl text-muted-foreground border-4 border-background">
                  {profile.firstName?.[0]}
                </div>
              )}
              <div className="text-white pt-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">{profile.creatorType || 'Creator'}</p>
              </div>
            </div>
            {/* Edit Btn */}
            <Button
              size="sm"
              className="absolute top-4 right-4 bg-white text-black hover:bg-gray-200"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </section>
        )}

        <ErrorBoundary fallback={() => (
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-white text-center">Profile display temporarily unavailable</p>
          </div>
        )}>
          {profile && (
            <div className="space-y-8">
              {/* Completion */}
              <div className="bg-card p-4 rounded-lg border border-border">
                <h3 className="text-lg font-medium text-white mb-2">Profile Completion</h3>
                <div className="w-full bg-muted h-2 rounded">
                  <div
                    style={{ width: `${profile.completion || 80}%` }}
                    className="h-2 rounded bg-primary transition-all"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(profile.completion || 80)}% complete — finish connecting more socials to reach 100%.
                </p>
              </div>

              {/* Tabs */}
              <div className="bg-card rounded-lg border border-border">
                <TabContainer />
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

/* ---------------- Tabs & Sections ---------------- */
const TabContainer = () => {
  const [tab, setTab] = useState<'overview'|'portfolio'|'audience'>('overview');
  return (
    <div className="p-6">
      {/* Tab Headers */}
      <div className="flex space-x-4 mb-6">
        {['overview','portfolio','audience'].map(k => (
          <button
            key={k}
            className={`text-sm font-medium capitalize px-3 py-1 rounded ${
              tab===k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white'
            }`}
            onClick={() => setTab(k as any)}
          >
            {k}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {tab === 'overview' && <OverviewSection />}
      {tab === 'portfolio' && <PortfolioSection />}
      {tab === 'audience' && <AudienceSection />}
    </div>
  );
};

const OverviewSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Social Metrics Card Placeholder */}
      <div className="bg-background rounded-lg p-4 border border-border">
        <h4 className="font-semibold mb-4">Social Metrics</h4>
        <p className="text-muted-foreground text-sm">Connect more social accounts to see detailed metrics.</p>
      </div>
      {/* About Card */}
      <div className="bg-background rounded-lg p-4 border border-border">
        <h4 className="font-semibold mb-4">About</h4>
        <p className="text-muted-foreground text-sm">
          Showcase your bio, experience, languages and location here. (coming soon)
        </p>
      </div>
    </div>
  );
};

const PortfolioSection = () => (
  <div className="text-muted-foreground text-sm">
    Upload your best work to impress brands. (portfolio feature coming soon)
  </div>
);

const AudienceSection = () => (
  <div className="text-muted-foreground text-sm">
    Audience demographics and insights will appear here once enough data is available.
  </div>
);


export default CreatorProfile;
