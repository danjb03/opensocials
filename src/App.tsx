
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
import NotFound from "./pages/NotFound";
import { useAuth } from "./lib/auth";
import BrandDashboard from "./pages/brand/Dashboard";
import CreatorSearch from "./pages/brand/CreatorSearch";
import BrandOrders from "./pages/brand/Orders";

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
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
