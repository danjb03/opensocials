
import { lazy } from 'react';

// Lazy load heavy components that aren't immediately needed
export const LazyEarningsChart = lazy(() => import('./EarningsChart'));
export const LazyUpdatesSection = lazy(() => import('./UpdatesSection'));
export const LazySocialGrowth = lazy(() => import('../analytics/SocialGrowth'));
