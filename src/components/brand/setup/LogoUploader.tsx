
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LogoUploaderProps {
  logoPreview: string | null;
  logoUrl: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearLogo: () => void;
}

const LogoUploader = ({ 
  logoPreview, 
  logoUrl, 
  onLogoChange, 
  onClearLogo 
}: LogoUploaderProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="logo">Logo</Label>
      <div className="flex items-center gap-4">
        {(logoPreview || logoUrl) && (
          <div className="relative">
            <img 
              src={logoPreview || logoUrl || ''} 
              alt="Logo preview" 
              className="w-16 h-16 object-cover rounded-md"
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
              onClick={onClearLogo}
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {!(logoPreview || logoUrl) && (
          <div className="relative">
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={onLogoChange}
              className="hidden"
            />
            <Label
              htmlFor="logo"
              className="flex items-center gap-2 p-2 border border-dashed rounded-md cursor-pointer hover:bg-accent"
            >
              <Upload size={20} />
              <span>Upload Logo</span>
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoUploader;
