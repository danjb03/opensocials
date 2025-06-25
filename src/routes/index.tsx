
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Auth Components
import AuthPage from '@/pages/auth/index';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Public Components
import Index from '@/pages/Index';

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

  // Debug logging to track the authentication state
  console.log('🔍 AppRoutes Debug:', {
    user: user ? { id: user.id, email: user.email } : null,
    role,
    brandProfile: brandProfile ? { company_name: brandProfile.company_name } : null,
    creatorProfile: creatorProfile ? { first_name: creatorProfile.first_name } : null,
    isLoading,
    currentPath: window.location.pathname
  });

  if (isLoading) {
    console.log('🔄 Still loading authentication state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Setup routes for users who need to complete their profiles
  const needsBrandSetup = role === 'brand' && !brandProfile?.company_name;
  const needsCreatorSetup = role === 'creator' && !creatorProfile?.first_name;

  console.log('🔍 Setup checks:', { needsBrandSetup, needsCreatorSetup });

  if (needsBrandSetup) {
    console.log('🔄 Redirecting to brand setup...');
    return (
      <Routes>
        <Route path="/setup/brand" element={<BrandSetup />} />
        <Route path="*" element={<Navigate to="/setup/brand" replace />} />
      </Routes>
    );
  }

  if (needsCreatorSetup) {
    console.log('🔄 Redirecting to creator setup...');
    return (
      <Routes>
        <Route path="/setup/creator" element={<CreatorSetup />} />
        <Route path="*" element={<Navigate to="/setup/creator" replace />} />
      </Routes>
    );
  }

  console.log('✅ Rendering main application routes...');

  // Main application routes - available to both authenticated and non-authenticated users
  return (
    <Routes>
      {/* Public marketing website */}
      <Route path="/" element={<Index />} />
      
      {/* Auth pages */}
      <Route path="/auth/*" element={<AuthPage />} />
      
      {/* Protected role-based routes */}
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

      {/* Fallback to homepage for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
