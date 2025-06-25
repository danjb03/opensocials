
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Settings, Eye } from 'lucide-react';
import { useCreatorProfileData } from '@/hooks/useCreatorProfileData';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import SocialAnalytics from '@/components/creator/dashboard/SocialAnalytics';
import CreatorProfileCard from '@/components/creator/CreatorProfileCard';
import LoadingSpinner from '@/components/ui/loading-spinner';

const CreatorProfile = () => {
  const { user, creatorProfile } = useUnifiedAuth();
  const { profile, isLoading } = useCreatorProfileData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    setActiveTab('edit');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setActiveTab('overview');
  };

  const handleSaveProfile = async (updatedProfile: any) => {
    // Profile saving logic would go here
    setIsEditing(false);
    setActiveTab('overview');
  };

  // Transform creator profile for the card using the unified auth data and profile data
  const creatorForCard = {
    id: user?.id || '',
    firstName: creatorProfile?.first_name || profile?.firstName || '',
    lastName: creatorProfile?.last_name || profile?.lastName || '',
    username: creatorProfile?.username || '',
    bio: creatorProfile?.bio || profile?.bio || '',
    avatarUrl: creatorProfile?.avatar_url || profile?.avatarUrl || '',
    primaryPlatform: creatorProfile?.primary_platform || profile?.primaryPlatform || '',
    platforms: creatorProfile?.platforms || profile?.platforms || [],
    industries: creatorProfile?.industries || profile?.industries || [],
    audienceLocation: creatorProfile?.audience_location || profile?.audienceLocation,
    followerCount: creatorProfile?.follower_count || parseInt(profile?.followerCount || '0') || 0,
    engagementRate: creatorProfile?.engagement_rate || parseFloat(profile?.engagementRate || '0') || 0,
    creatorType: creatorProfile?.creator_type || profile?.creatorType || '',
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your creator profile and social media connections.
          </p>
        </div>
        <Button 
          onClick={handleEditProfile}
          className="bg-white text-black hover:bg-gray-100"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            Brand View
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="edit" disabled={!isEditing}>
            <Settings className="w-4 h-4" />
            Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Card Preview */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Profile Preview</h2>
              <CreatorProfileCard 
                creator={creatorForCard}
                showActions={false}
              />
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {creatorProfile?.platforms?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Connected Platforms</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {creatorProfile?.industries?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Industries</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Complete</span>
                      <span>{creatorProfile?.is_profile_complete ? '100%' : '60%'}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: creatorProfile?.is_profile_complete ? '100%' : '60%' }}
                      />
                    </div>
                    {!creatorProfile?.is_profile_complete && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Complete your profile setup to maximize visibility
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Brand View</h2>
            <p className="text-muted-foreground">
              This is how brands will see your profile when they discover you
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="max-w-md">
              <CreatorProfileCard 
                creator={creatorForCard}
                onInvite={() => {}}
                onViewProfile={() => {}}
                showActions={true}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SocialAnalytics
            socialConnections={{
              instagram: true,
              tiktok: true,
              youtube: true,
              linkedin: true
            }}
            platformAnalytics={{
              instagram: { followers: '0', engagement: '0%', growth: '0%' },
              tiktok: { followers: '0', engagement: '0%', growth: '0%' },
              youtube: { followers: '0', engagement: '0%', growth: '0%' }
            }}
            visibilitySettings={profile?.visibilitySettings || {
              showInstagram: true,
              showTiktok: true,
              showYoutube: true,
              showLinkedin: true,
              showLocation: true,
              showAnalytics: true
            }}
            onConnect={() => {}}
            isLoading={false}
          />
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          {profile && (
            <ProfileEditForm
              profile={profile}
              isLoading={false}
              onSubmit={handleSaveProfile}
              onCancel={handleCancelEdit}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorProfile;
