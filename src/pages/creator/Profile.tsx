
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { User, Settings, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreatorProfile = () => {
  const { user } = useCreatorAuth();
  const { data: profile, isLoading } = useCreatorProfile();

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

  const completionPercentage = profile?.isProfileComplete ? 100 : 
    (profile?.firstName && profile?.lastName) ? 60 : 20;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your creator profile and settings</p>
        </div>
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
                <label className="text-sm font-medium text-muted-foreground">Primary Platform</label>
                <p className="text-sm">{profile?.primaryPlatform || 'Not set'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Content Type</label>
                <p className="text-sm">{profile?.contentType || 'Not set'}</p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link to="/creator/profile/setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
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
              Connect your social media accounts to showcase your content and analytics.
            </p>

            <div className="space-y-3">
              {['Instagram', 'TikTok', 'YouTube', 'LinkedIn'].map((platform) => {
                const isConnected = profile?.socialConnections?.[platform.toLowerCase() as keyof typeof profile.socialConnections];
                
                return (
                  <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-medium">{platform[0]}</span>
                      </div>
                      <span className="font-medium">{platform}</span>
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

            <Button variant="outline" className="w-full" asChild>
              <Link to="/creator/profile/setup">
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Connections
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild>
                <Link to="/creator/analytics">
                  View Analytics
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/creator/campaigns">
                  View Campaigns
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/creator/deals">
                  View Deals
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorProfile;
