
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import ProjectManagement from '@/pages/admin/ProjectManagement';
import OrderManagement from '@/pages/admin/OrderManagement';
import AdminCRM from '@/pages/admin/crm';
import BrandCRM from '@/pages/admin/crm/brands';
import BrandDetail from '@/pages/admin/crm/brands/[brand_id]';
import CreatorCRM from '@/pages/admin/crm/creators';
import CreatorDetail from '@/pages/admin/crm/creators/[id]';
import DealsPipeline from '@/pages/admin/crm/deals';
import UserManagement from '@/pages/admin/UserManagement';
import CreatorLeaderboard from '@/pages/admin/crm/creators/leaderboard';
import BrandLeaderboard from '@/pages/admin/crm/brands/leaderboard';
import InviteUsers from '@/pages/admin/InviteUsers';
import PricingFloors from '@/pages/admin/PricingFloors';
import SecurityPage from '@/pages/admin/Security';
import CampaignReview from '@/pages/admin/CampaignReview';
import AdminSettings from '@/pages/admin/Settings';
import PlatformMap from '@/pages/admin/PlatformMap';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="invite" element={<InviteUsers />} />
              <Route path="project-management" element={<ProjectManagement />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="order-management" element={<OrderManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="campaign-review" element={<CampaignReview />} />
              <Route path="pricing-floors" element={<PricingFloors />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="platform-map" element={<PlatformMap />} />
              <Route path="crm" element={<AdminCRM />} />
              <Route path="crm/brands/leaderboard" element={<BrandLeaderboard />} />
              <Route path="crm/brands/:brandId" element={<BrandDetail />} />
              <Route path="crm/brands" element={<BrandCRM />} />
              <Route path="crm/creators/leaderboard" element={<CreatorLeaderboard />} />
              <Route path="crm/creators/:id" element={<CreatorDetail />} />
              <Route path="crm/creators" element={<CreatorCRM />} />
              <Route path="crm/deals" element={<DealsPipeline />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;
