
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormFieldWrapperProps {
  label: string;
  error?: string;
  success?: boolean;
  isValidating?: boolean;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormFieldWrapper({
  label,
  error,
  success,
  isValidating,
  children,
  className,
  required = false
}: FormFieldWrapperProps) {
  const hasError = !!error;
  const hasSuccess = success && !hasError && !isValidating;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-1">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {isValidating && (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
        {hasSuccess && (
          <CheckCircle className="w-4 h-4 text-green-600 animate-scale-in" />
        )}
      </div>
      
      <div className="relative">
        {children}
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-destructive animate-fade-in" />
          </div>
        )}
      </div>
      
      {hasError && (
        <p className="text-sm text-destructive animate-fade-in flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      
      {hasSuccess && (
        <p className="text-sm text-green-600 animate-fade-in flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Looks good!
        </p>
      )}
    </div>
  );
}
