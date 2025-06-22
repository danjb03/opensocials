
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import Agencies from "@/pages/admin/users/Agencies";
import Brands from "@/pages/admin/users/Brands";
import Creators from "@/pages/admin/users/Creators";

export const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <SuperAdminLayout>
        <Routes>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="users/agencies" element={<Agencies />} />
          <Route path="users/brands" element={<Brands />} />
          <Route path="users/creators" element={<Creators />} />
        </Routes>
      </SuperAdminLayout>
    </ProtectedRoute>
  );
};
