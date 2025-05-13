
import * as React from "react";
import { toast as sonnerToast } from "sonner";

// Re-export the direct toast function for simplified usage
export const toast = sonnerToast;

export type ToastProps = React.ComponentProps<typeof sonnerToast> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Create a custom hook for backward compatibility with shadcn/ui toast pattern
export const useToast = () => {
  const toast = {
    // Standard toast methods using sonner
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
    // Legacy shadcn/ui style toast function
    // This allows calling toast({ title: "...", description: "..." })
    toast: (props: ToastProps) => {
      if (props.variant === "destructive") {
        return sonnerToast.error(props.title as string, {
          description: props.description as string,
        });
      }
      
      return sonnerToast(props.title as string, {
        description: props.description as string,
      });
    }
  };

  return toast;
};
