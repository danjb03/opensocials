
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './index';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import ProjectManagement from '@/pages/admin/ProjectManagement';
import OrderManagement from '@/pages/admin/OrderManagement';
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

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="invite" element={<InviteUsers />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="pricing-floors" element={<PricingFloors />} />
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
