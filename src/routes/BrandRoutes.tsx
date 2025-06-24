
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BrandGuard from '@/components/auth/BrandGuard';
import BrandLayout from '@/components/layouts/BrandLayout';
import BrandDashboard from '@/pages/brand/Dashboard';
import BrandCampaigns from '@/pages/brand/Campaigns';
import BrandOrders from '@/pages/brand/Orders';
import BrandCreators from '@/pages/brand/Creators';
import BrandSettings from '@/pages/brand/Settings';
import CampaignWizard from '@/components/brand/campaign-wizard/CampaignWizard';
import CampaignReview from '@/pages/brand/CampaignReview';

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
          <Route path="create-campaign" element={<CampaignWizard />} />
          <Route path="campaign-review/:id" element={<CampaignReview />} />
        </Routes>
      </BrandLayout>
    </BrandGuard>
  );
};

export default BrandRoutes;
