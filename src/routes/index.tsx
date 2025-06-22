
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Auth Components
import AuthPage from '@/pages/auth/AuthPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Setup Components
import BrandSetup from '@/pages/setup/BrandSetup';
import CreatorSetup from '@/pages/setup/CreatorSetup';

// Route Components
import AdminRoutes from './AdminRoutes';
import BrandRoutes from './BrandRoutes';
import { CreatorRoutes } from './CreatorRoutes';
import { SuperAdminRoutes } from './SuperAdminRoutes';
import AgencyRoutes from './AgencyRoutes';

const AppRoutes = () => {
  const { user, role, brandProfile, creatorProfile, isLoading } = useUnifiedAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Auth routes for non-authenticated users
  if (!user) {
    return (
      <Routes>
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // Setup routes for users who need to complete their profiles
  const needsBrandSetup = role === 'brand' && !brandProfile?.company_name;
  const needsCreatorSetup = role === 'creator' && !creatorProfile?.first_name;

  if (needsBrandSetup) {
    return (
      <Routes>
        <Route path="/setup/brand" element={<BrandSetup />} />
        <Route path="*" element={<Navigate to="/setup/brand" replace />} />
      </Routes>
    );
  }

  if (needsCreatorSetup) {
    return (
      <Routes>
        <Route path="/setup/creator" element={<CreatorSetup />} />
        <Route path="*" element={<Navigate to="/setup/creator" replace />} />
      </Routes>
    );
  }

  // Main application routes
  return (
    <Routes>
      {/* Redirect root to appropriate dashboard */}
      <Route path="/" element={<Navigate to={`/${role}/dashboard`} replace />} />
      
      {/* Role-based routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminRoutes />
        </ProtectedRoute>
      } />
      
      <Route path="/brand/*" element={
        <ProtectedRoute>
          <BrandRoutes />
        </ProtectedRoute>
      } />
      
      <Route path="/creator/*" element={
        <ProtectedRoute>
          <CreatorRoutes />
        </ProtectedRoute>
      } />

      <Route path="/agency/*" element={
        <ProtectedRoute>
          <AgencyRoutes />
        </ProtectedRoute>
      } />

      <Route path="/super_admin/*" element={
        <ProtectedRoute>
          <SuperAdminRoutes />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={`/${role}/dashboard`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
