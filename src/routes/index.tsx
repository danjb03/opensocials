
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Index from "@/pages/Index";
import AuthPage from "@/pages/auth";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import DataDeletion from "@/pages/DataDeletion";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/NotFound";
import ConnectCallback from "@/pages/connect/Callback";
import AdminRoutes from "./AdminRoutes";
import { BrandRoutes } from "./BrandRoutes";
import { CreatorRoutes } from "./CreatorRoutes";
import { SuperAdminRoutes } from "./SuperAdminRoutes";

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Super admins can access any protected route regardless of the required role
  if (requiredRole && role !== requiredRole && role !== 'super_admin') {
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
      
      {/* Social Media Connection Callback - accessible to all authenticated users */}
      <Route 
        path="/connect/callback" 
        element={
          <ProtectedRoute>
            <ConnectCallback />
          </ProtectedRoute>
        } 
      />
      
      {/* Role-based routes */}
      <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminRoutes /></ProtectedRoute>} />
      <Route path="/brand/*" element={<ProtectedRoute requiredRole="brand"><BrandRoutes /></ProtectedRoute>} />
      <Route path="/creator/*" element={<ProtectedRoute requiredRole="creator"><CreatorRoutes /></ProtectedRoute>} />
      <Route path="/super-admin/*" element={<ProtectedRoute requiredRole="super_admin"><SuperAdminRoutes /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
