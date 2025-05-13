import { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ContentUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  allowedTypes?: string[]; // e.g. ['image/jpeg', 'image/png', 'video/mp4']
}

const ContentUploader = ({
  onFilesSelected,
  maxFileSize = 100, // Default 100MB
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'video/mp4']
}: ContentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles) {
        onFilesSelected(validFiles);
      }
      // Clear the input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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

export default ContentUploader;
