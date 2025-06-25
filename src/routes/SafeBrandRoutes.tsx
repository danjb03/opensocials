import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ClientOnly, SupabaseReady, LoadingCard } from '@/components/safe-components';
import { ErrorMessage } from '@/components/safe-components';
import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import the safe campaign review component directly
import SafeCampaignReviewPanel from '@/components/brand/campaign-review/SafeCampaignReviewPanel';

// Lazy load other brand pages to prevent build-time initialization
const Dashboard = lazy(() => import('@/pages/brand/Dashboard'));
const Projects = lazy(() => import('@/pages/brand/Projects'));
const ProjectDetail = lazy(() => import('@/pages/brand/ProjectDetail'));
const ProjectView = lazy(() => import('@/pages/brand/ProjectView'));
const Creators = lazy(() => import('@/pages/brand/Creators'));
const CreatorSearch = lazy(() => import('@/pages/brand/CreatorSearch'));
const Campaigns = lazy(() => import('@/pages/brand/Campaigns'));
const CreateCampaign = lazy(() => import('@/pages/brand/CreateCampaign'));
const EditCampaign = lazy(() => import('@/pages/brand/EditCampaign'));
const CampaignStatus = lazy(() => import('@/pages/brand/CampaignStatus'));
const Orders = lazy(() => import('@/pages/brand/Orders'));
const Settings = lazy(() => import('@/pages/brand/Settings'));
const SetupProfile = lazy(() => import('@/pages/brand/SetupProfile'));
const ManageBudget = lazy(() => import('@/pages/brand/ManageBudget'));
const CampaignAnalytics = lazy(() => import('@/pages/brand/CampaignAnalytics'));
const CampaignAnalyticsList = lazy(() => import('@/pages/brand/CampaignAnalyticsList'));

// Custom safe version of CampaignReview page
const SafeCampaignReview = lazy(() => import('@/pages/brand/CampaignReview').then(module => {
  // This ensures the page uses our SafeCampaignReviewPanel component
  const OriginalComponent = module.default;
  return {
    default: (props: any) => (
      <SupabaseReady>
        <ErrorBoundary fallback={(error) => (
          <ErrorMessage 
            message={`Error loading campaign review: ${error.message}`}
            showRetry={true}
            onRetry={() => window.location.reload()}
          />
        )}>
          <OriginalComponent {...props} useSafeComponents={true} />
        </ErrorBoundary>
      </SupabaseReady>
    )
  };
}));

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
 * Safe Brand Routes
 * Implements build-time protection patterns from loveable.dev
 * Uses ClientOnly and SupabaseReady wrappers to prevent white screen errors
 * Special focus on making CampaignReview route safe from initialization errors
 */
const SafeBrandRoutes = () => {
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
        path="/projects" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Projects />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/projects/:id" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <ProjectDetail />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/projects/:id/view" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <ProjectView />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/creators" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Creators />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/creator-search" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <CreatorSearch />
                </SupabaseReady>
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
        path="/campaigns/create" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <CreateCampaign />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/campaigns/:id/edit" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <EditCampaign />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/campaigns/:id/status" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <CampaignStatus />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      {/* Special focus on the CampaignReview route */}
      <Route 
        path="/campaigns/:id/review" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SafeCampaignReview />
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Orders />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <Settings />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/setup" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <SetupProfile />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/budget" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <ManageBudget />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
      <Route 
        path="/analytics/:id" 
        element={
          <ClientOnly fallback={<PageLoader />}>
            <ErrorBoundary fallback={<PageError />}>
              <Suspense fallback={<PageLoader />}>
                <SupabaseReady fallback={<PageLoader />}>
                  <CampaignAnalytics />
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
                  <CampaignAnalyticsList />
                </SupabaseReady>
              </Suspense>
            </ErrorBoundary>
          </ClientOnly>
        } 
      />
    </Routes>
  );
};

export default SafeBrandRoutes;
