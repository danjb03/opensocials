import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import AuthPage from "./pages/auth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserManagement from "./pages/admin/UserManagement";
import AdminDashboard from "./pages/admin/Dashboard";
import CreatorManagement from "./pages/admin/CreatorManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import NotFound from "./pages/NotFound";
import { useAuth } from "./lib/auth";
import BrandDashboard from "./pages/brand/Dashboard";
import CreatorSearch from "./pages/brand/CreatorSearch";
import BrandOrders from "./pages/brand/Orders";
import AdminLayout from "./components/layouts/AdminLayout";
import CreatorDashboard from "./pages/creator/Dashboard";
import CreatorDeals from "./pages/creator/Deals";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

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

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
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
            </Route>
            
            {/* Brand Dashboard Routes */}
            <Route 
              path="/brand" 
              element={
                <ProtectedRoute requiredRole="brand">
                  <BrandDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/brand/creators" 
              element={
                <ProtectedRoute requiredRole="brand">
                  <CreatorSearch />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/brand/orders" 
              element={
                <ProtectedRoute requiredRole="brand">
                  <BrandOrders />
                </ProtectedRoute>
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
