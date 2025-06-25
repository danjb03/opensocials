
import React, { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [emergencyRender, setEmergencyRender] = useState(false);
  
  console.log('🚀 App component rendering...');

  // EMERGENCY: Always render app within 500ms
  useEffect(() => {
    const emergencyTimer = setTimeout(() => {
      console.log('⚡ EMERGENCY: App forced to render after 500ms');
      setEmergencyRender(true);
    }, 500);
    
    return () => clearTimeout(emergencyTimer);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
