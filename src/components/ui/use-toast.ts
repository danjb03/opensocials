
// Re-export hook and toast function from our custom implementation
import { useToast, toast, type ToastProps } from "@/hooks/use-toast";
import { Toaster } from "sonner";

export { useToast, toast, Toaster, type ToastProps };
