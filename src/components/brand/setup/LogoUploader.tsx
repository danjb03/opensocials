
import { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LogoUploaderProps {
  logoPreview: string | null;
  logoUrl: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoFileSelect: (file: File) => void;
  onClearLogo: () => void;
}

const LogoUploader = ({ logoPreview, logoUrl, onLogoChange, onLogoFileSelect, onClearLogo }: LogoUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const currentLogo = logoPreview || logoUrl;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onLogoFileSelect(file);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base">Company Logo</Label>
      
      {currentLogo ? (
        <div className="relative">
          <div className="w-full max-w-xs mx-auto sm:mx-0">
            <img
              src={currentLogo}
              alt="Company logo"
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-border mx-auto sm:mx-0"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onClearLogo}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            >
              <X size={12} />
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center sm:text-left">
            Click the X to remove or upload a new image
          </p>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('logo-upload')?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 sm:p-3 rounded-full bg-muted">
              <Camera size={20} className="sm:hidden" />
              <Upload size={24} className="hidden sm:block" />
            </div>
            <div>
              <p className="text-sm font-medium">Upload your logo</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}
      
      <input
        id="logo-upload"
        type="file"
        accept="image/*"
        onChange={onLogoChange}
        className="hidden"
      />
    </div>
  );
};

export default LogoUploader;
