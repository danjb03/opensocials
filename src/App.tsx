
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { UnifiedAuthProvider } from "./hooks/useUnifiedAuth";
import AppRoutes from "./routes";

function App() {
  return (
    <UnifiedAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </UnifiedAuthProvider>
  );
}

export default App;
