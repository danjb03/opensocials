
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./index";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import BrandDashboard from "@/pages/brand/Dashboard";
import CreatorDashboard from "@/pages/creator/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";

export const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <Routes>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="brands" element={<BrandDashboard />} />
        <Route path="creators" element={<CreatorDashboard />} />
        <Route path="admins" element={<AdminDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
};
