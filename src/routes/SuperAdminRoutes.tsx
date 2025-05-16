
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./index";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import BrandDashboard from "@/pages/brand/Dashboard";
import CreatorDashboard from "@/pages/creator/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";

export const SuperAdminRoutes = () => {
  return (
    <>
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
    </>
  );
};
