
import * as React from "react";
import { toast as sonnerToast, type ToastT } from "sonner";

export const toast = sonnerToast;

export type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  [key: string]: any;
};

export const useToast = () => {
  return {
    toast: ({ title, description, variant, ...props }: ToastProps) => {
      if (variant === "destructive") {
        return sonnerToast.error(title as string, {
          description: description as string,
          ...props
        });
      } else if (variant === "success") {
        return sonnerToast.success(title as string, {
          description: description as string,
          ...props
        });
      } else {
        return sonnerToast(title as string, {
          description: description as string,
          ...props
        });
      }
    },
    // Add direct methods for convenience
    success: (title: string, { description, ...props }: Omit<ToastProps, "title" | "variant"> = {}) => {
      return sonnerToast.success(title, {
        description,
        ...props
      });
    },
    error: (title: string, { description, ...props }: Omit<ToastProps, "title" | "variant"> = {}) => {
      return sonnerToast.error(title, {
        description,
        ...props
      });
    },
    warning: (title: string, { description, ...props }: Omit<ToastProps, "title" | "variant"> = {}) => {
      return sonnerToast.warning(title, {
        description,
        ...props
      });
    },
    info: (title: string, { description, ...props }: Omit<ToastProps, "title" | "variant"> = {}) => {
      return sonnerToast.info(title, {
        description,
        ...props
      });
    }
  };
};
