
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
import CreatorRoutes from './CreatorRoutes';

const AppRoutes = () => {
  const { user, userRole, brandProfile, creatorProfile, isLoading } = useUnifiedAuth();

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
  const needsBrandSetup = userRole === 'brand' && !brandProfile?.company_name;
  const needsCreatorSetup = userRole === 'creator' && !creatorProfile?.first_name;

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
      <Route path="/" element={<Navigate to={`/${userRole}/dashboard`} replace />} />
      
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to={`/${userRole}/dashboard`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
