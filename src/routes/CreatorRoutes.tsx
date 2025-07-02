
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import CreatorDashboard from '@/pages/creator/Dashboard';
import CreatorAnalytics from '@/pages/creator/Analytics';
import CreatorDeals from '@/pages/creator/Deals';
import CreatorCampaigns from '@/pages/creator/Campaigns';
import CampaignDetail from '@/pages/creator/CampaignDetail';
import ContentUpload from '@/pages/creator/ContentUpload';
import CreatorInvitations from '@/pages/creator/Invitations';
import ProfileSetup from '@/pages/creator/profile/Setup';
import CreatorProfile from '@/pages/creator/Profile';

export const CreatorRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={
        <ProtectedRoute requiredRole="creator">
          <CreatorLayout>
            <Routes>
              <Route index element={<CreatorDashboard />} />
              <Route path="dashboard" element={<CreatorDashboard />} />
              <Route path="profile" element={<CreatorProfile />} />
              <Route path="profile/setup" element={<ProfileSetup />} />
              <Route path="profile/complete-setup" element={<ProfileSetup />} />
              <Route path="analytics" element={<CreatorAnalytics />} />
              <Route path="deals" element={<CreatorDeals />} />
              <Route path="campaigns" element={<CreatorCampaigns />} />
              <Route path="campaigns/:id" element={<CampaignDetail />} />
              <Route path="campaigns/:id/upload" element={<ContentUpload />} />
              <Route path="invitations" element={<CreatorInvitations />} />
            </Routes>
          </CreatorLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
