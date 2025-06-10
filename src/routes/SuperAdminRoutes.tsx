
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./index";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";

export const SuperAdminRoutes = () => {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <Routes>
        <Route index element={<SuperAdminDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
};
