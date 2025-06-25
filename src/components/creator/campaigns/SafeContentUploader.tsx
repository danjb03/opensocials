import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { isSupabaseReady } from '@/integrations/supabase/safe-client';

interface ContentUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  allowedTypes?: string[]; // e.g. ['image/jpeg', 'image/png', 'video/mp4']
}

/**
 * Safe Content Uploader component
 * Implements build-time protection patterns from loveable.dev
 * Prevents white screen errors during initialization
 */
const SafeContentUploader = ({
  onFilesSelected,
  maxFileSize = 100, // Default 100MB
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'video/mp4']
}: ContentUploaderProps) => {
  // Client-side rendering check
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // ContentUploader state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if we're in a browser environment after mount
  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);

  // Check if Supabase is ready
  const supabaseReady = isSupabaseReady();

  // Handle retry when there's an error
  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  // Show loading state during SSR or when explicitly loading
  if (!isClient || isLoading) {
    return (
      <div className="border-2 border-dashed rounded-md p-6 border-muted flex flex-col items-center justify-center text-center">
        <Loader2 className="h-10 w-10 mb-2 text-muted-foreground animate-spin" />
        <h3 className="font-medium mb-1">Loading uploader...</h3>
      </div>
    );
  }

  // Show error state if Supabase isn't ready or there's an error
  if (!supabaseReady || error) {
    return (
      <div className="border-2 border-dashed rounded-md p-6 border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-10 w-10 mb-2 text-destructive" />
        <h3 className="font-medium mb-1">Uploader unavailable</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {error?.message || "The content uploader is currently unavailable."}
        </p>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    );
  }

  // Original ContentUploader functionality
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFiles = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    const oversizedFiles: string[] = [];
    
    // Convert FileList to array
    const fileArray = Array.from(files);
    
    // Check if too many files selected
    if (fileArray.length > maxFiles) {
      toast.error(`Too many files selected. Maximum ${maxFiles} files allowed.`);
      return null;
    }

    // Validate each file
    fileArray.forEach(file => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(file.name);
        return;
      }
      
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        oversizedFiles.push(file.name);
        return;
      }
      
      validFiles.push(file);
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      const fileList = invalidFiles.slice(0, 3).join(', ') + 
        (invalidFiles.length > 3 ? ` and ${invalidFiles.length - 3} more` : '');
      toast.error(`Invalid file type(s): ${fileList}. Only images and videos are allowed.`);
    }
    
    if (oversizedFiles.length > 0) {
      const fileList = oversizedFiles.slice(0, 3).join(', ') + 
        (oversizedFiles.length > 3 ? ` and ${oversizedFiles.length - 3} more` : '');
      toast.error(`Some files exceed the ${maxFileSize}MB limit: ${fileList}`);
    }

    return validFiles.length > 0 ? validFiles : null;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        const validFiles = validateFiles(e.dataTransfer.files);
        if (validFiles) {
          onFilesSelected(validFiles);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to process files'));
        console.error('Error processing dropped files:', err);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const validFiles = validateFiles(e.target.files);
        if (validFiles) {
          onFilesSelected(validFiles);
        }
        // Clear the input value so the same file can be selected again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to process files'));
        console.error('Error processing selected files:', err);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={allowedTypes.join(',')}
        multiple
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-md p-6 ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted'
        } transition-all flex flex-col items-center justify-center text-center cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <UploadCloud className={`h-10 w-10 mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <h3 className="font-medium mb-1">
          {isDragging ? 'Drop files to upload' : 'Drag & drop files here'}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          or click to browse files from your device
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, MP4 (max {maxFileSize}MB)
        </p>
      </div>
    </div>
  );
};

export default SafeContentUploader;
