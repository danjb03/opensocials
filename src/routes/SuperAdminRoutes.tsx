
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./index";
import Agencies from "@/pages/admin/users/Agencies";
import Brands from "@/pages/admin/users/Brands";
import Creators from "@/pages/admin/users/Creators";

export const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <Routes>
        {/* Redirect to admin dashboard instead of non-existent super admin dashboard */}
        <Route index element={<Navigate to="/admin" replace />} />
        <Route path="users/agencies" element={<Agencies />} />
        <Route path="users/brands" element={<Brands />} />
        <Route path="users/creators" element={<Creators />} />
      </Routes>
    </ProtectedRoute>
  );
};
