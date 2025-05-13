
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// This format matches the sonner toast function
export const toast = {
  // Standard toast with modern options
  success: (message: string, options?: { description?: string }) => {
    return sonnerToast.success(message, {
      description: options?.description,
    });
  },
  error: (message: string, options?: { description?: string }) => {
    return sonnerToast.error(message, {
      description: options?.description,
    });
  },
  warning: (message: string, options?: { description?: string }) => {
    return sonnerToast.warning(message, {
      description: options?.description,
    });
  },
  info: (message: string, options?: { description?: string }) => {
    return sonnerToast.info(message, {
      description: options?.description,
    });
  },
  // Legacy toast format for backward compatibility
  // Allows passing in a ToastProps object
  ...((props?: ToastProps) => {
    if (!props) {
      return sonnerToast;
    }
    
    if (props.variant === "destructive") {
      return sonnerToast.error(props.title as string, {
        description: props.description as string,
      });
    }
    
    return sonnerToast(props.title as string, {
      description: props.description as string,
    });
  }),
};

// Hook for components that need to display toast messages
export const useToast = () => {
  return {
    toast
  };
};
