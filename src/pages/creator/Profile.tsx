
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { User, Settings, ExternalLink, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileEditForm from '@/components/creator/ProfileEditForm';

const CreatorProfile = () => {
  const { user } = useCreatorAuth();
  const { profile, isLoading } = useCreatorProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (updatedProfile: any) => {
    // Handle profile update logic here
    console.log('Profile update:', updatedProfile);
    setIsEditing(false);
  };

  const completionPercentage = profile?.isProfileComplete ? 100 : 
    (profile?.firstName && profile?.lastName) ? 60 : 20;

  if (isEditing && profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Update your creator profile information</p>
          </div>
        </div>
        
        <ProfileEditForm
          profile={profile}
          isLoading={false}
          onSubmit={handleProfileSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">View and manage your creator profile</p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profile Overview
              {profile?.isProfileComplete ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {completionPercentage}% Complete
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">
                  {profile?.firstName && profile?.lastName 
                    ? `${profile.firstName} ${profile.lastName}` 
                    : 'Not set'
                  }
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{user?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Bio</label>
                <p className="text-sm">{profile?.bio || 'Not set'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Creator Type</label>
                <p className="text-sm">{profile?.creatorType || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform & Content Info */}
        <Card>
          <CardHeader>
            <CardTitle>Platform & Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Primary Platform</label>
              <p className="text-sm">{profile?.primaryPlatform || 'Not set'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Content Types</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile?.contentTypes && profile.contentTypes.length > 0 ? (
                  profile.contentTypes.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm">Not set</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Industries</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile?.industries && profile.industries.length > 0 ? (
                  profile.industries.map((industry, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {industry}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm">Not set</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Audience Location</label>
              <p className="text-sm">{profile?.audienceLocation?.primary || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Social Connections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your connected social media accounts and handles.
            </p>

            <div className="space-y-3">
              {['Instagram', 'TikTok', 'YouTube', 'LinkedIn'].map((platform) => {
                const platformKey = platform.toLowerCase() as keyof typeof profile.socialConnections;
                const isConnected = profile?.socialConnections?.[platformKey];
                const handle = profile?.socialHandles?.[platformKey];
                
                return (
                  <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-medium">{platform[0]}</span>
                      </div>
                      <div>
                        <span className="font-medium">{platform}</span>
                        {handle && <p className="text-xs text-muted-foreground">@{handle}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Connected</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Followers</label>
                <p className="text-lg font-semibold">
                  {profile?.followerCount ? profile.followerCount.toLocaleString() : '0'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Engagement Rate</label>
                <p className="text-lg font-semibold">
                  {profile?.engagementRate ? `${profile.engagementRate}%` : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Link to="/creator/analytics">
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </Link>
              
              <Link to="/creator/campaigns">
                <Button variant="outline" className="w-full">
                  View Campaigns
                </Button>
              </Link>
              
              <Link to="/creator/deals">
                <Button variant="outline" className="w-full">
                  View Deals
                </Button>
              </Link>

              <Link to="/creator/profile/setup">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Setup
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorProfile;
