import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClientOnly, SupabaseReady, LoadingCard, ErrorMessage } from '@/components/safe-components';
import ErrorBoundary from '@/components/ErrorBoundary';
import { isSupabaseReady } from '@/integrations/supabase/safe-client';

// Safe routes
import SafeCreatorRoutes from './SafeCreatorRoutes';
import SafeBrandRoutes from './SafeBrandRoutes';

// Lazy load other route components to prevent build-time initialization
const Index = lazy(() => import('@/pages/Index'));
const AuthRoutes = lazy(() => import('./AuthRoutes'));
const AdminRoutes = lazy(() => import('./AdminRoutes'));
const AgencyRoutes = lazy(() => import('./AgencyRoutes'));
const SuperAdminRoutes = lazy(() => import('./SuperAdminRoutes'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const DataDeletion = lazy(() => import('@/pages/DataDeletion'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading and error components
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingCard message="Loading application..." />
  </div>
);

const PageError = ({ error }: { error?: Error }) => (
  <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
    <ErrorMessage 
      message={error?.message || "Something went wrong. Please try again later."} 
      showRetry={true}
      onRetry={() => window.location.reload()}
    />
  </div>
);

/**
 * Safe Routes
 * Implements build-time protection patterns from loveable.dev
 * Uses ClientOnly and SupabaseReady wrappers to prevent white screen errors
 */
const SafeRoutes = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // If not in browser, render nothing (SSR safety)
  if (!isBrowser) {
    return null;
  }

  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<PageError />}>
        <ClientOnly fallback={<PageLoader />}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes that don't require Supabase */}
              <Route path="/" element={<Index />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              
              {/* Auth routes with Supabase safety */}
              <Route path="/auth/*" element={
                <SupabaseReady fallback={<PageLoader />}>
                  <AuthRoutes />
                </SupabaseReady>
              } />
              
              {/* Role-specific routes with Supabase safety */}
              <Route path="/creator/*" element={<SafeCreatorRoutes />} />
              <Route path="/brand/*" element={<SafeBrandRoutes />} />
              <Route path="/admin/*" element={
                <SupabaseReady fallback={<PageLoader />}>
                  <AdminRoutes />
                </SupabaseReady>
              } />
              <Route path="/agency/*" element={
                <SupabaseReady fallback={<PageLoader />}>
                  <AgencyRoutes />
                </SupabaseReady>
              } />
              <Route path="/super-admin/*" element={
                <SupabaseReady fallback={<PageLoader />}>
                  <SuperAdminRoutes />
                </SupabaseReady>
              } />
              
              {/* Fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </ClientOnly>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default SafeRoutes;
