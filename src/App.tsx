
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { MinimalApp } from "./components/MinimalApp";
import AppRoutes from "./routes";

// Create query client outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [showEmergencyMode, setShowEmergencyMode] = useState(true);
  const [emergencyTimeout, setEmergencyTimeout] = useState(false);
  
  console.log('🚀 App component rendering...');

  // Emergency timeout - if app doesn't load in 3 seconds, show full app anyway
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⚡ Emergency timeout reached - showing full app');
      setEmergencyTimeout(true);
      setShowEmergencyMode(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Try to load full app after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔄 Attempting to load full app...');
      setShowEmergencyMode(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show emergency mode initially or if forced
  if (showEmergencyMode && !emergencyTimeout) {
    return <MinimalApp />;
  }

  // Try to render full app with error boundary
  try {
    return (
      <TooltipProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    );
  } catch (error) {
    console.error('❌ Full app failed to render:', error);
    return <MinimalApp />;
  }
}

export default App;
