
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ToastManagerProps {
  error?: string | null;
  success?: string | null;
  onErrorDismiss?: () => void;
  onSuccessDismiss?: () => void;
}

export function ToastManager({ 
  error, 
  success, 
  onErrorDismiss, 
  onSuccessDismiss 
}: ToastManagerProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      onErrorDismiss?.();
    }
  }, [error, toast, onErrorDismiss]);

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: success,
      });
      onSuccessDismiss?.();
    }
  }, [success, toast, onSuccessDismiss]);

  return null;
}
