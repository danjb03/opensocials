
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./index";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import UserManagement from "@/pages/admin/UserManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import ProjectManagement from "@/pages/admin/ProjectManagement";
import BrandsCRM from "@/pages/admin/crm/brands/index";
import BrandDetailPage from "@/pages/admin/crm/brands/[brand_id]";
import CreatorsCRM from "@/pages/admin/crm/creators/index";
import CreatorDetailPage from "@/pages/admin/crm/creators/[id]";
import DealPipelinePage from "@/pages/admin/crm/deals/index";

export const AdminRoutes = () => {
  return (
    <>
      {/* Admin Main Routes with Layout */}
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
        <Route path="orders" element={<OrderManagement />} />
        <Route path="projects" element={<ProjectManagement />} />
      </Route>

      {/* Redirect from the old creator management URL to the new CRM URL */}
      <Route 
        path="/admin/creators" 
        element={<Navigate to="/admin/crm/creators" replace />} 
      />
      
      {/* Admin CRM Routes */}
      <Route 
        path="/admin/crm/brands" 
        element={
          <ProtectedRoute requiredRole="admin">
            <BrandsCRM />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/crm/brands/:brand_id" 
        element={
          <ProtectedRoute requiredRole="admin">
            <BrandDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/crm/creators" 
        element={
          <ProtectedRoute requiredRole="admin">
            <CreatorsCRM />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/crm/creators/:id" 
        element={
          <ProtectedRoute requiredRole="admin">
            <CreatorDetailPage />
          </ProtectedRoute>
        } 
      />
      {/* Deal Pipeline Route */}
      <Route 
        path="/admin/crm/deals" 
        element={
          <ProtectedRoute requiredRole="admin">
            <DealPipelinePage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};
