import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import CreatorProfileHeader from '@/components/creator/CreatorProfileHeader';
import SocialPlatformConnect from '@/components/creator/SocialPlatformConnect';
import AnalyticsModule from '@/components/creator/AnalyticsModule';
import AudienceLocation from '@/components/creator/AudienceLocation';
import EmptyProfileState from '@/components/creator/EmptyProfileState';
import ProfileEditForm from '@/components/creator/ProfileEditForm';
import VisibilityControls from '@/components/creator/VisibilityControls';
import OAuthConnectButtons from '@/components/creator/OAuthConnectButtons';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { 
    profile, 
    isLoading, 
    isEditing, 
    setIsEditing,
    isPreviewMode,
    setIsPreviewMode,
    updateProfile,
    uploadAvatar,
    toggleVisibilitySetting,
    connectSocialPlatform,
    platformAnalytics
  } = useCreatorProfile();
  
  const { data: earnings } = useQuery({
    queryKey: ['creator-earnings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deal_earnings')
        .select('amount, earned_at')
        .eq('creator_id', user?.id)
        .order('earned_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: connections } = useQuery({
    queryKey: ['creator-connections', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_creator_connections')
        .select('status')
        .eq('creator_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: deals } = useQuery({
    queryKey: ['creator-deals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('value, status')
        .eq('creator_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const totalEarnings = earnings?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
  const pipelineValue = deals
    ?.filter(deal => deal.status === 'pending')
    .reduce((sum, deal) => sum + deal.value, 0) || 0;
    
  const connectionStats = {
    outreach: connections?.filter(c => c.status === 'outreach').length || 0,
    in_talks: connections?.filter(c => c.status === 'in_talks').length || 0,
    working: connections?.filter(c => c.status === 'working').length || 0,
  };

  const earningsData = earnings?.map(earning => ({
    date: new Date(earning.earned_at).toLocaleDateString(),
    amount: earning.amount,
  })) || [];

  const handleProfileSubmit = (values: any) => {
    console.log("Profile submission values:", values);
    updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      bio: values.bio,
      primaryPlatform: values.primaryPlatform,
      contentType: values.contentType,
      audienceType: values.audience,
      audienceLocation: {
        primary: values.location,
        secondary: profile?.audienceLocation?.secondary || [],
        countries: profile?.audienceLocation?.countries || [
          { name: 'United States', percentage: 30 },
          { name: 'United Kingdom', percentage: 20 },
          { name: 'Canada', percentage: 15 },
          { name: 'Australia', percentage: 10 },
          { name: 'Others', percentage: 25 }
        ]
      },
      isProfileComplete: true // Automatically mark profile as complete on submit
    });
    setIsEditing(false); // Close the edit form after submission
  };

  const handleStartProfileSetup = () => {
    setIsEditing(true);
  };

  const handleOAuthConnect = async (platform: string) => {
    try {
      await connectSocialPlatform(platform);
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    }
  };

  const renderContent = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      );
    }

    // Show edit form
    if (isEditing) {
      return (
        <ProfileEditForm 
          initialValues={{
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            bio: profile?.bio || '',
            primaryPlatform: profile?.primaryPlatform || '',
            contentType: profile?.contentType || '',
            audience: profile?.audienceType || '',
            location: profile?.audienceLocation?.primary || ''
          }}
          avatarUrl={profile?.avatarUrl || undefined}
          onSubmit={handleProfileSubmit}
          onCancel={() => setIsEditing(false)}
          onAvatarChange={uploadAvatar}
        />
      );
    }

    // Show empty state if profile is not set up
    if (!profile?.isProfileComplete && !isPreviewMode) {
      return <EmptyProfileState onStartProfileSetup={handleStartProfileSetup} />;
    }

    // Show regular profile view
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Pipeline Value</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${pipelineValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">In pending deals</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Brand Connections</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{
                connectionStats.outreach + connectionStats.in_talks + connectionStats.working
              }</div>
              <p className="text-sm text-muted-foreground">
                {connectionStats.working} active collaborations
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* OAuth Connect Buttons - Show prominently after initial profile creation */}
            <OAuthConnectButtons 
              platforms={profile?.socialConnections || {
                instagram: false,
                tiktok: false,
                youtube: false,
                linkedin: false
              }} 
              isLoading={isLoading}
            />
            
            {/* Show legacy SocialPlatformConnect for any connected platforms */}
            <SocialPlatformConnect 
              platforms={profile?.socialConnections || {
                instagram: false,
                tiktok: false,
                youtube: false,
                linkedin: false
              }} 
              onConnect={handleOAuthConnect}
              isEditable={true}
            />
            
            {/* Analytics Modules - one for each connected platform */}
            {profile?.socialConnections.instagram && (
              <AnalyticsModule 
                platform="Instagram" 
                metrics={{
                  followers: platformAnalytics.instagram?.followers || '15.2K',
                  engagement: platformAnalytics.instagram?.engagement || '3.2%',
                  views: '5,600 avg',
                  likes: '1,200 avg',
                  verified: true,
                  growthRate: platformAnalytics.instagram?.growth || '+2.5%'
                }}
                isVisible={profile?.visibilitySettings.showInstagram}
              />
            )}
            
            {profile?.socialConnections.tiktok && (
              <AnalyticsModule 
                platform="TikTok" 
                metrics={{
                  followers: platformAnalytics.tiktok?.followers || '22.4K',
                  engagement: platformAnalytics.tiktok?.engagement || '5.7%',
                  views: '8,900 avg',
                  likes: '2,100 avg',
                  verified: false,
                  growthRate: platformAnalytics.tiktok?.growth || '+4.1%'
                }}
                isVisible={profile?.visibilitySettings.showTiktok}
              />
            )}
            
            {profile?.socialConnections.youtube && (
              <AnalyticsModule 
                platform="YouTube" 
                metrics={{
                  followers: platformAnalytics.youtube?.followers || '8.7K',
                  engagement: platformAnalytics.youtube?.engagement || '2.8%',
                  views: '3,200 avg',
                  likes: '780 avg',
                  verified: true,
                  growthRate: platformAnalytics.youtube?.growth || '+1.2%'
                }}
                isVisible={profile?.visibilitySettings.showYoutube}
              />
            )}

            {/* Audience Location */}
            {profile?.audienceLocation && (
              <AudienceLocation 
                audienceLocation={profile.audienceLocation}
                isVisible={profile.visibilitySettings.showLocation}
              />
            )}
            
            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Right sidebar with visibility controls */}
          <div className="space-y-6">
            <VisibilityControls 
              visibilitySettings={profile?.visibilitySettings || {
                showInstagram: true,
                showTiktok: true,
                showYoutube: true,
                showLinkedin: true,
                showLocation: true,
                showAnalytics: true
              }}
              onToggleVisibility={toggleVisibilitySetting}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-6">
        <CreatorProfileHeader 
          name={profile ? `${profile.firstName} ${profile.lastName}` : 'Creator Profile'}
          imageUrl={profile?.avatarUrl || undefined}
          bannerUrl={profile?.bannerUrl || undefined}
          bio={profile?.bio || 'No bio yet. Add one to complete your profile.'}
          platform={profile?.primaryPlatform}
          followers={profile?.followerCount}
          isEditable={true}
          onEditProfile={() => setIsEditing(true)}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          isPreviewMode={isPreviewMode}
        />
        
        {renderContent()}
      </div>
    </CreatorLayout>
  );
};

export default CreatorDashboard;
