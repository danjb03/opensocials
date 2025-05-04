
export const useBrandNavigation = () => {
  const redirectToDashboard = () => {
    console.log("Attempting to navigate to /brand");
    
    // Set a flag to bypass the redirect check in BrandGuard
    window.localStorage.setItem('bypass_brand_check', 'true');
    
    // Force a full page reload to ensure fresh data
    window.location.href = '/brand';
  };

  return { redirectToDashboard };
};
