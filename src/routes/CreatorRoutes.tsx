
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import InstantLoadingFallback from '@/components/creator/dashboard/InstantLoadingFallback';
import { useRoutePreloader } from '@/hooks/useRoutePreloader';

// Lazy load pages for better initial bundle size
const CreatorDashboard = React.lazy(() => import('@/pages/creator/Dashboard'));
const CreatorAnalytics = React.lazy(() => import('@/pages/creator/Analytics'));
const CreatorDeals = React.lazy(() => import('@/pages/creator/Deals'));
const CreatorCampaigns = React.lazy(() => import('@/pages/creator/Campaigns'));
const CampaignDetail = React.lazy(() => import('@/pages/creator/CampaignDetail'));
const ContentUpload = React.lazy(() => import('@/pages/creator/ContentUpload'));
const ProfileSetup = React.lazy(() => import('@/pages/creator/profile/Setup'));
const CreatorProfile = React.lazy(() => import('@/pages/creator/Profile'));

export const CreatorRoutes = () => {
  useRoutePreloader(); // Preload routes for faster navigation

  return (
    <Routes>
      <Route path="/*" element={
        <ProtectedRoute requiredRole="creator">
          <CreatorLayout>
            <Suspense fallback={<InstantLoadingFallback />}>
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
              </Routes>
            </Suspense>
          </CreatorLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
