import { Routes, Route, Navigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import Index from "@/pages/Index";
import AuthPage from "@/pages/auth";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import DataDeletion from "@/pages/DataDeletion";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/NotFound";
import AdminRoutes from "./AdminRoutes";
import { BrandRoutes } from "./BrandRoutes";
import { CreatorRoutes } from "./CreatorRoutes";
import { SuperAdminRoutes } from "./SuperAdminRoutes";
import AgencyRoutes from "./AgencyRoutes";

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, role, isLoading } = useUnifiedAuth();

  console.log('ProtectedRoute - User:', user?.id);
  console.log('ProtectedRoute - Role:', role);
  console.log('ProtectedRoute - Required Role:', requiredRole);
  console.log('ProtectedRoute - Loading:', isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Super admins can access any protected route regardless of the required role
  if (role === 'super_admin') {
    console.log('ProtectedRoute - Super admin access granted');
    return <>{children}</>;
  }

  // For non-super-admin users, check if they have the required role
  if (requiredRole && role !== requiredRole) {
    console.log('ProtectedRoute - Role mismatch, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/reset-password" element={<ForgotPassword />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/tos" element={<TermsOfService />} />
      
      {/* Super Admin routes - Must come BEFORE other role-based routes */}
      <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
      
      {/* Other role-based routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/agency/*" element={<AgencyRoutes />} />
      <Route path="/brand/*" element={<BrandRoutes />} />
      <Route path="/creator/*" element={<CreatorRoutes />} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
