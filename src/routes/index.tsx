
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Super admins can access any protected route regardless of the required role
  if (role === 'super_admin') {
    return <>{children}</>;
  }

  // For non-super-admin users, check if they have the required role
  if (requiredRole && role !== requiredRole) {
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
      
      {/* Role-based routes - Super admins can access all of these */}
      <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminRoutes /></ProtectedRoute>} />
      <Route path="/agency/*" element={<ProtectedRoute requiredRole="agency"><AgencyRoutes /></ProtectedRoute>} />
      <Route path="/brand/*" element={<ProtectedRoute requiredRole="brand"><BrandRoutes /></ProtectedRoute>} />
      <Route path="/creator/*" element={<ProtectedRoute requiredRole="creator"><CreatorRoutes /></ProtectedRoute>} />
      <Route path="/super-admin/*" element={<ProtectedRoute requiredRole="super_admin"><SuperAdminRoutes /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
