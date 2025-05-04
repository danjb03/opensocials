
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FilePlus, FileCheck } from 'lucide-react';

interface BriefUploaderProps {
  nextStepBlocked: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  briefFiles: File[];
  isUploading: boolean;
  handleProgressCampaign: () => void;
}

export const BriefUploader: React.FC<BriefUploaderProps> = ({
  nextStepBlocked,
  handleFileChange,
  briefFiles,
  isUploading,
  handleProgressCampaign,
}) => {
  return (
    <div className="py-4">
      <div className="font-medium text-gray-700 mb-2">Campaign Brief & Contract</div>
      <div className={`${nextStepBlocked ? 'bg-red-50 border-red-200' : 'bg-gray-50'} border-2 border-dashed rounded-lg p-6 mt-2 flex flex-col items-center transition-colors duration-200`}>
        <div className="mb-4 flex flex-col items-center">
          <Upload className={`h-12 w-12 ${nextStepBlocked ? 'text-red-400' : 'text-gray-400'} mb-3`} />
          <p className="font-medium text-gray-700">Upload Campaign Brief & Contract</p>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {nextStepBlocked ? 
              'You must upload your campaign brief before proceeding to the next step' : 
              'Upload your campaign brief, contract, and any other relevant documents for approval'}
          </p>
        </div>
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center shadow-sm">
            <FilePlus className="mr-2 h-4 w-4" />
            Select Files
          </div>
          <input 
            id="file-upload" 
            name="file-upload" 
            type="file" 
            className="sr-only" 
            multiple
            onChange={handleFileChange}
          />
        </label>

        {briefFiles.length > 0 && (
          <div className="mt-4 w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
            <div className="space-y-2">
              {briefFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-white p-2 rounded border shadow-sm">
                  <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleProgressCampaign} 
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Files & Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
