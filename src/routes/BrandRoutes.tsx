
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BrandGuard from '@/components/auth/BrandGuard';
import BrandLayout from '@/components/layouts/BrandLayout';
import BrandDashboard from '@/pages/brand/Dashboard';
import BrandOrders from '@/pages/brand/Orders';
import BrandCreators from '@/pages/brand/Creators';
import BrandSettings from '@/pages/brand/Settings';
import CreateCampaign from '@/pages/brand/CreateCampaign';

const BrandRoutes = () => {
  return (
    <BrandGuard>
      <BrandLayout>
        <Routes>
          <Route index element={<BrandDashboard />} />
          <Route path="dashboard" element={<BrandDashboard />} />
          <Route path="orders" element={<BrandOrders />} />
          <Route path="creators" element={<BrandCreators />} />
          <Route path="settings" element={<BrandSettings />} />
          <Route path="create-campaign" element={<CreateCampaign />} />
        </Routes>
      </BrandLayout>
    </BrandGuard>
  );
};

export default BrandRoutes;
