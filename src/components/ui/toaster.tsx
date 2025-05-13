
import { Toaster } from 'sonner';

export function Toaster() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        className: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        descriptionClassName: 'group-[.toast]:text-muted-foreground',
      }}
    />
  );
}
