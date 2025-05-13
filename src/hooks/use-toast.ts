
import * as React from "react";
import { toast as sonnerToast } from "sonner";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export type SonnerToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

// This is needed for compatibility with the Toaster component
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

export function useToast() {
  // For backward compatibility with components expecting the old toast API
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  // Simplified toast function that uses Sonner
  const toast = ({ title, description, variant = "default", duration }: SonnerToastProps) => {
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        duration,
      });
    }
    
    if (variant === "success") {
      return sonnerToast.success(title, {
        description,
        duration,
      });
    }
    
    return sonnerToast(title, {
      description,
      duration,
    });
  };

  return { 
    toast,
    toasts, // Return empty array for compatibility
    dismiss: () => {}, // No-op function for compatibility
  };
}

export { sonnerToast as toast };
