
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
  const { user, role, isLoading } = useUnifiedAuth();

  console.log('🚦 AppRoutes state:', {
    isLoading,
    hasUser: !!user,
    role,
    path: window.location.pathname
  });

  // Show loading only briefly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-white">Loading OS Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public marketing website - ALWAYS accessible */}
      <Route path="/" element={<Index />} />
      
      {/* Auth pages */}
      <Route path="/auth/*" element={<AuthPage />} />
      
      {/* Setup routes */}
      <Route path="/setup/brand" element={<BrandSetup />} />
      <Route path="/setup/creator" element={<CreatorSetup />} />
      
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
