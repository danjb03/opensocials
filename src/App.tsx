import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import AuthPage from "./pages/auth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserManagement from "./pages/admin/UserManagement";
import AdminDashboard from "./pages/admin/Dashboard";
import CreatorManagement from "./pages/admin/CreatorManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import NotFound from "./pages/NotFound";
import { useAuth } from "./lib/auth";
import BrandDashboard from "./pages/brand/Dashboard";
import CreatorSearch from "./pages/brand/CreatorSearch";
import BrandOrders from "./pages/brand/Orders";
import Projects from "./pages/brand/Projects";
import SetupProfile from "./pages/brand/SetupProfile";
import BrandGuard from "./components/BrandGuard";
import AdminLayout from "./components/layouts/AdminLayout";
import CreatorDashboard from "./pages/creator/Dashboard";
import CreatorDeals from "./pages/creator/Deals";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import DataDeletion from "./pages/DataDeletion";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import BrandOnboardingGuard from "./components/BrandOnboardingGuard";
import ProjectView from './pages/brand/ProjectView';
import EditCampaign from './pages/brand/EditCampaign';
import ManageBudget from './pages/brand/ManageBudget';
import CampaignAnalytics from './pages/brand/CampaignAnalytics';
import CampaignAnalyticsList from './pages/brand/CampaignAnalyticsList';

const ProtectedRoute = ({ children, requiredRole }: { 
  children: React.ReactNode, 
  requiredRole?: string 
}) => {
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

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/reset-password" element={<ForgotPassword />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/tos" element={<TermsOfService />} />
              
              {/* Creator Dashboard Routes */}
              <Route 
                path="/creator" 
                element={
                  <ProtectedRoute requiredRole="creator">
                    <CreatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator/analytics" 
                element={
                  <ProtectedRoute requiredRole="creator">
                    <CreatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator/deals" 
                element={
                  <ProtectedRoute requiredRole="creator">
                    <CreatorDeals />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="creators" element={<CreatorManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="projects" element={<ProjectManagement />} />
              </Route>
              
              {/* Brand Dashboard Routes */}
              <Route 
                path="/brand/setup-profile" 
                element={
                  <ProtectedRoute requiredRole="brand">
                    <SetupProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brand" 
                element={
                  <BrandOnboardingGuard>
                    <BrandDashboard />
                  </BrandOnboardingGuard>
                } 
              />
              <Route 
                path="/brand/projects" 
                element={
                  <BrandOnboardingGuard>
                    <Projects />
                  </BrandOnboardingGuard>
                } 
              />
              <Route 
                path="/brand/creators" 
                element={
                  <BrandOnboardingGuard>
                    <CreatorSearch />
                  </BrandOnboardingGuard>
                } 
              />
              <Route 
                path="/brand/orders" 
                element={
                  <BrandOnboardingGuard>
                    <BrandOrders />
                  </BrandOnboardingGuard>
                } 
              />
              <Route 
                path="/brand/projects/:id" 
                element={
                  <BrandGuard>
                    <ProjectView />
                  </BrandGuard>
                } 
              />
              {/* Add the new routes */}
              <Route 
                path="/brand/projects/edit/:id" 
                element={
                  <BrandGuard>
                    <EditCampaign />
                  </BrandGuard>
                } 
              />
              <Route 
                path="/brand/projects/budget/:id" 
                element={
                  <BrandGuard>
                    <ManageBudget />
                  </BrandGuard>
                } 
              />
              <Route 
                path="/brand/projects/analytics/:id" 
                element={
                  <BrandGuard>
                    <CampaignAnalytics />
                  </BrandGuard>
                } 
              />
              <Route 
                path="/brand/analytics" 
                element={
                  <BrandGuard>
                    <CampaignAnalyticsList />
                  </BrandGuard>
                } 
              />
              
              {/* Super Admin Routes */}
              <Route 
                path="/super-admin" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/super-admin/brands" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <BrandDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/super-admin/creators" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <CreatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/super-admin/admins" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
