
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./index";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import Agencies from "@/pages/admin/users/Agencies";
import Brands from "@/pages/admin/users/Brands";
import Creators from "@/pages/admin/users/Creators";

export const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <Routes>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="users/agencies" element={<Agencies />} />
        <Route path="users/brands" element={<Brands />} />
        <Route path="users/creators" element={<Creators />} />
      </Routes>
    </ProtectedRoute>
  );
};
