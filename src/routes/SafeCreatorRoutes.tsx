import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ClientOnly, SupabaseReady, LoadingCard } from '@/components/safe-components';
import { ErrorMessage } from '@/components/safe-components';
import SafeContentUpload from '@/pages/creator/SafeContentUpload';
import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load other creator pages to prevent build-time initialization
const Dashboard = lazy(() => import('@/pages/creator/Dashboard'));
const Campaigns = lazy(() => import('@/pages/creator/Campaigns'));
const CampaignDetail = lazy(() => import('@/pages/creator/CampaignDetail'));
const Profile = lazy(() => import('@/pages/creator/Profile'));
const Deals = lazy(() => import('@/pages/creator/Deals'));
const Analytics = lazy(() => import('@/pages/creator/Analytics'));

// Loading and error components
const PageLoader = () => (
  <div className="container mx-auto p-6">
    <LoadingCard message="Loading page content..." />
  </div>
);

const PageError = ({ error }: { error?: Error }) => (
  <div className="container mx-auto p-6">
    <ErrorMessage 
      message={error?.message || "Failed to load page. Please try again later."} 
      showRetry={true}
      onRetry={() => window.location.reload()}
    />
  </div>
);

/**
 * Safe Creator Routes
 * Implements build-time protection patterns from loveable.dev
 * Uses ClientOnly and SupabaseReady wrappers to prevent white screen errors
 */
const SafeCreatorRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/campaigns" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Campaigns />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/campaigns/:id" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <CampaignDetail />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/campaigns/:id/upload" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <SafeContentUpload />
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Profile />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/deals" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Deals />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Analytics />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
    </Routes>
  );
};

export default SafeCreatorRoutes;
