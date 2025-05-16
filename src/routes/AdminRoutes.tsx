
import { Routes, Route, Navigate } from "react-router-dom";
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
    <ProtectedRoute requiredRole="admin">
      <Routes>
        {/* Admin Main Routes with Layout */}
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="projects" element={<ProjectManagement />} />
        </Route>
        
        {/* CRM Routes - Direct components with AdminLayout already included */}
        <Route path="crm/brands" element={<BrandsCRM />} />
        <Route path="crm/brands/:brand_id" element={<BrandDetailPage />} />
        <Route path="crm/creators" element={<CreatorsCRM />} />
        <Route path="crm/creators/:id" element={<CreatorDetailPage />} />
        <Route path="crm/deals" element={<DealPipelinePage />} />
        
        {/* Redirect from the old creator management URL to the new CRM URL */}
        <Route path="creators" element={<Navigate to="/admin/crm/creators" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}
