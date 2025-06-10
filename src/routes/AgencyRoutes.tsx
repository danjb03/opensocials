
import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import AgencyLayout from '@/components/layouts/AgencyLayout';
import AgencyDashboard from '@/pages/agency/Dashboard';
import AgencyUserManagement from '@/pages/agency/UserManagement';
import AgencyInviteUsers from '@/pages/agency/InviteUsers';
import AgencyProjectManagement from '@/pages/agency/ProjectManagement';
import AgencyOrderManagement from '@/pages/agency/OrderManagement';
import AgencyBrandCRM from '@/pages/agency/crm/brands';
import AgencyBrandDetail from '@/pages/agency/crm/brands/[brand_id]';
import AgencyCreatorCRM from '@/pages/agency/crm/creators';
import AgencyCreatorDetail from '@/pages/agency/crm/creators/[id]';
import AgencyDealsPipeline from '@/pages/agency/crm/deals';
import AgencyCreatorLeaderboard from '@/pages/agency/crm/creators/leaderboard';
import AgencyBrandLeaderboard from '@/pages/agency/crm/brands/leaderboard';

const AgencyRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<AgencyLayout><Outlet /></AgencyLayout>}>
        <Route index element={<AgencyDashboard />} />
        <Route path="users" element={<AgencyUserManagement />} />
        <Route path="invite" element={<AgencyInviteUsers />} />
        <Route path="projects" element={<AgencyProjectManagement />} />
        <Route path="orders" element={<AgencyOrderManagement />} />
        <Route path="crm/brands/leaderboard" element={<AgencyBrandLeaderboard />} />
        <Route path="crm/brands/:brandId" element={<AgencyBrandDetail />} />
        <Route path="crm/brands" element={<AgencyBrandCRM />} />
        <Route path="crm/creators/leaderboard" element={<AgencyCreatorLeaderboard />} />
        <Route path="crm/creators/:id" element={<AgencyCreatorDetail />} />
        <Route path="crm/creators" element={<AgencyCreatorCRM />} />
        <Route path="crm/deals" element={<AgencyDealsPipeline />} />
      </Route>
    </Routes>
  );
};

export default AgencyRoutes;
