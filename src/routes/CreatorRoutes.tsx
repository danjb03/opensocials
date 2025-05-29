
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./index";
import CreatorDashboard from "@/pages/creator/Dashboard";
import CreatorAnalytics from "@/pages/creator/Analytics";
import CreatorDeals from "@/pages/creator/Deals";
import CreatorCampaigns from "@/pages/creator/Campaigns";
import CampaignDetail from "@/pages/creator/CampaignDetail";
import ContentUpload from "@/pages/creator/ContentUpload";
import ConnectCallback from "@/pages/connect/Callback";

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
      
      {/* Social Media Connection Callback */}
      <Route 
        path="connect/callback" 
        element={
          <ProtectedRoute requiredRole="creator">
            <ConnectCallback />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
