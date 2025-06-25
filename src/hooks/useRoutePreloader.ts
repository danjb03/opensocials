
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Simplified route preloader to prevent infinite loops
const routePreloadMap = {
  '/creator': () => import('@/pages/creator/Dashboard'),
  '/creator/dashboard': () => import('@/pages/creator/Dashboard'),
  '/creator/campaigns': () => import('@/pages/creator/Campaigns'),
  '/creator/deals': () => import('@/pages/creator/Deals'),
  '/creator/analytics': () => import('@/pages/creator/Analytics'),
  '/creator/profile': () => import('@/pages/creator/Profile'),
};

export const useRoutePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    // Simple preloading without aggressive optimization that caused loops
    if (location.pathname.startsWith('/creator')) {
      // Preload only the most commonly accessed routes
      const commonRoutes = ['/creator/dashboard', '/creator/campaigns'];
      commonRoutes.forEach(route => {
        if (routePreloadMap[route as keyof typeof routePreloadMap]) {
          setTimeout(() => {
            routePreloadMap[route as keyof typeof routePreloadMap]();
          }, 500); // Delayed preloading to prevent issues
        }
      });
    }
  }, [location.pathname]);

  // Return preload function for manual preloading
  return {
    preloadRoute: (path: keyof typeof routePreloadMap) => {
      if (routePreloadMap[path]) {
        routePreloadMap[path]();
      }
    }
  };
};
