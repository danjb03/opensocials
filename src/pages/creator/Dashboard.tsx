
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import CreatorProfileHeader from '@/components/creator/CreatorProfileHeader';
import VisibilityControls from '@/components/creator/VisibilityControls';
import DashboardContent from '@/components/creator/dashboard/DashboardContent';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';

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

  const handleProfileSubmit = async (values: Partial<CreatorProfile>) => {
    await updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      bio: values.bio,
      primaryPlatform: values.primaryPlatform,
      contentType: values.contentType,
      audienceType: values.audienceType,
      audienceLocation: {
        primary: values.audienceLocation?.primary || profile?.audienceLocation?.primary || '',
        secondary: profile?.audienceLocation?.secondary || [],
        countries: profile?.audienceLocation?.countries || [
          { name: 'United States', percentage: 30 },
          { name: 'United Kingdom', percentage: 20 },
          { name: 'Canada', percentage: 15 },
          { name: 'Australia', percentage: 10 },
          { name: 'Others', percentage: 25 }
        ]
      },
      industries: values.industries || [],
      creatorType: values.creatorType || '',
      isProfileComplete: true
    });
    setIsEditing(false);
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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <DashboardContent 
              profile={profile}
              isLoading={isLoading}
              isEditing={isEditing}
              isPreviewMode={isPreviewMode}
              totalEarnings={totalEarnings}
              pipelineValue={pipelineValue}
              connectionStats={connectionStats}
              earningsData={earningsData}
              platformAnalytics={platformAnalytics}
              onProfileSubmit={handleProfileSubmit}
              onCancelEdit={() => setIsEditing(false)}
              onStartProfileSetup={handleStartProfileSetup}
              onAvatarChange={uploadAvatar}
              onConnectPlatform={handleOAuthConnect}
            />
          </div>
          
          <div className="lg:col-span-1">
            {profile && (
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
            )}
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDashboard;
