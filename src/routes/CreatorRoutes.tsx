
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./index";
import CreatorDashboard from "@/pages/creator/Dashboard";
import CreatorDeals from "@/pages/creator/Deals";
import CreatorCampaigns from "@/pages/creator/Campaigns";
import CampaignDetail from "@/pages/creator/CampaignDetail";
import ContentUpload from "@/pages/creator/ContentUpload";

export const CreatorRoutes = () => {
  return (
    <>
      {/* Creator Dashboard Routes */}
      <Route 
        path="/creator" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/creator/analytics" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/creator/deals" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorDeals />
          </ProtectedRoute>
        } 
      />
      
      {/* Creator Campaign Routes */}
      <Route 
        path="/creator/campaigns" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CreatorCampaigns />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/creator/campaigns/:id" 
        element={
          <ProtectedRoute requiredRole="creator">
            <CampaignDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/creator/campaigns/:id/upload" 
        element={
          <ProtectedRoute requiredRole="creator">
            <ContentUpload />
          </ProtectedRoute>
        } 
      />
    </>
  );
};
