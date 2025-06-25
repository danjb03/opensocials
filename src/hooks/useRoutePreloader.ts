
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Preload critical routes to eliminate loading delays
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
    // Preload commonly accessed routes
    const currentPath = location.pathname;
    
    // Preload routes based on current location
    if (currentPath.startsWith('/creator')) {
      // Preload all creator routes immediately
      Object.values(routePreloadMap).forEach(loader => {
        setTimeout(() => loader(), 100); // Stagger preloading
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
