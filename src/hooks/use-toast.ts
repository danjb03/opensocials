
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
      });
    }
    
    if (variant === "success") {
      return sonnerToast.success(title, {
        description,
      });
    }
    
    return sonnerToast(title, {
      description,
    });
  };

  return { toast };
}

export { sonnerToast as toast };
