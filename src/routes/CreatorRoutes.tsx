
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { Navigate } from 'react-router-dom';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import CreatorDashboard from '@/pages/creator/Dashboard';
import CreatorAnalytics from '@/pages/creator/Analytics';
import CreatorDeals from '@/pages/creator/Deals';
import CreatorCampaigns from '@/pages/creator/Campaigns';
import CampaignDetail from '@/pages/creator/CampaignDetail';
import ContentUpload from '@/pages/creator/ContentUpload';
import ProfileSetup from '@/pages/creator/profile/Setup';
import CreatorProfile from '@/pages/creator/Profile';
import SocialAccounts from '@/pages/creator/SocialAccounts';

export const CreatorRoutes = () => {

  /**
   * Gate that ensures a creator has completed the mandatory onboarding
   * flow before they can access any creator-area routes.  If the profile
   * is incomplete we hard-redirect to the setup route. This is an extra
   * guard in addition to the global redirect in `src/routes/index.tsx`
   * so that deep-links or manual path entry cannot bypass onboarding.
   */
  const EnsureCreatorOnboarded: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { profile, isLoading } = useCreatorProfile();

    // still fetching profile – render nothing to avoid flicker
    if (isLoading) return null;

    // profile not complete → push to setup
    if (!profile?.isProfileComplete) {
      return <Navigate to="/creator/profile/setup" replace />;
    }

    // all good – render protected children
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/*" element={
        <ProtectedRoute requiredRole="creator">
          <EnsureCreatorOnboarded>
            <CreatorLayout>
              <Routes>
              <Route index element={<CreatorDashboard />} />
              <Route path="dashboard" element={<CreatorDashboard />} />
              <Route path="profile" element={<CreatorProfile />} />
              <Route path="profile/setup" element={<ProfileSetup />} />
              {/* Social accounts comes immediately after profile */}
              <Route path="social-accounts" element={<SocialAccounts />} />
              <Route path="analytics" element={<CreatorAnalytics />} />
              <Route path="deals" element={<CreatorDeals />} />
              <Route path="campaigns" element={<CreatorCampaigns />} />
              <Route path="campaigns/:id" element={<CampaignDetail />} />
              <Route path="campaigns/:id/upload" element={<ContentUpload />} />
              </Routes>
            </CreatorLayout>
          </EnsureCreatorOnboarded>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
