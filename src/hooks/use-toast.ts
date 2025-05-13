
import * as React from "react";
import { toast } from "sonner";

type ToastProps = React.ComponentProps<typeof toast> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Re-export toast methods with proper typing support
export const useToast = () => {
  return {
    toast: {
      // Standard toast methods
      success: (title: string, options?: { description?: string }) => {
        return toast.success(title, {
          description: options?.description,
        });
      },
      error: (title: string, options?: { description?: string }) => {
        return toast.error(title, {
          description: options?.description,
        });
      },
      warning: (title: string, options?: { description?: string }) => {
        return toast.warning(title, {
          description: options?.description,
        });
      },
      info: (title: string, options?: { description?: string }) => {
        return toast.info(title, {
          description: options?.description,
        });
      },
      // Legacy format for backward compatibility
      // Allows calling toast({ title: "...", description: "..." })
      ...(props?: ToastProps) => {
        if (!props) return toast;
        
        if (props.variant === "destructive") {
          return toast.error(props.title as string, {
            description: props.description as string,
          });
        }
        
        return toast(props.title as string, {
          description: props.description as string,
        });
      },
    },
  };
};
