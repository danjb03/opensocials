
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X } from 'lucide-react';

interface SummaryHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="font-medium text-xl text-white">Campaign Details</h3>
      
      {isEditing ? (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
            className="bg-black hover:bg-gray-800"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEdit}
          className="border border-gray-300 hover:bg-gray-50"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Edit Details
        </Button>
      )}
    </div>
  );
};

export default SummaryHeader;
