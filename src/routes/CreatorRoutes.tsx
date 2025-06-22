
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CreatorDashboard from "@/pages/creator/Dashboard";
import CreatorAnalytics from "@/pages/creator/Analytics";
import CreatorDeals from "@/pages/creator/Deals";
import CreatorCampaigns from "@/pages/creator/Campaigns";
import CampaignDetail from "@/pages/creator/CampaignDetail";
import ContentUpload from "@/pages/creator/ContentUpload";
import ProfileSetup from "@/pages/creator/profile/Setup";
import CreatorProfile from "@/pages/creator/Profile";

export const CreatorRoutes = () => {
  return (
    <Routes>
      {/* Creator Dashboard Routes */}
      <Route
        path=""
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile/setup"
        element={
          <ProtectedRoute requiredRole="creator">
            <ProfileSetup />
          </ProtectedRoute>
        }
      />
      <Route 
        path="analytics" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorAnalytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="deals" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorDeals />
          </ProtectedRoute>
        } 
      />
      
      {/* Creator Campaign Routes */}
      <Route 
        path="campaigns" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorCampaigns />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="campaigns/:id" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CampaignDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="campaigns/:id/upload" 
        element={
          <ProtectedRoute requiredRole="creator">
            <ContentUpload />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
