
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./index";
import BrandGuard from "@/components/BrandGuard";
import BrandOnboardingGuard from "@/components/BrandOnboardingGuard";
import SetupProfile from "@/pages/brand/SetupProfile";
import BrandDashboard from "@/pages/brand/Dashboard";
import Projects from "@/pages/brand/Projects";
import CreatorSearch from "@/pages/brand/CreatorSearch";
import BrandOrders from "@/pages/brand/Orders";
import ProjectView from '@/pages/brand/ProjectView';
import EditCampaign from '@/pages/brand/EditCampaign';
import ManageBudget from '@/pages/brand/ManageBudget';
import CampaignAnalytics from '@/pages/brand/CampaignAnalytics';
import CampaignAnalyticsList from '@/pages/brand/CampaignAnalyticsList';

export const BrandRoutes = () => {
  return (
    <Routes>
      {/* Brand Setup Route */}
      <Route 
        path="setup-profile" 
        element={
          <ProtectedRoute requiredRole="brand">
            <SetupProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* Brand Dashboard Routes with Onboarding Guard */}
      <Route 
        path="" 
        element={
          <BrandOnboardingGuard>
            <BrandDashboard />
          </BrandOnboardingGuard>
        } 
      />
      <Route 
        path="projects" 
        element={
          <BrandOnboardingGuard>
            <Projects />
          </BrandOnboardingGuard>
        } 
      />
      <Route 
        path="creators" 
        element={
          <BrandOnboardingGuard>
            <CreatorSearch />
          </BrandOnboardingGuard>
        } 
      />
      <Route 
        path="orders" 
        element={
          <BrandOnboardingGuard>
            <BrandOrders />
          </BrandOnboardingGuard>
        } 
      />
      
      {/* Brand Project Routes with Regular Brand Guard */}
      <Route 
        path="projects/:id" 
        element={
          <BrandGuard>
            <ProjectView />
          </BrandGuard>
        } 
      />
      <Route 
        path="projects/edit/:id" 
        element={
          <BrandGuard>
            <EditCampaign />
          </BrandGuard>
        } 
      />
      <Route 
        path="projects/budget/:id" 
        element={
          <BrandGuard>
            <ManageBudget />
          </BrandGuard>
        } 
      />
      <Route 
        path="projects/analytics/:id" 
        element={
          <BrandGuard>
            <CampaignAnalytics />
          </BrandGuard>
        } 
      />
      <Route 
        path="analytics" 
        element={
          <BrandGuard>
            <CampaignAnalyticsList />
          </BrandGuard>
        } 
      />
    </Routes>
  );
};
