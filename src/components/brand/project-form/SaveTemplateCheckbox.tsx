
import React from 'react';

interface SaveTemplateCheckboxProps {
  saveAsTemplate: boolean;
  onChange: (checked: boolean) => void;
}

export const SaveTemplateCheckbox: React.FC<SaveTemplateCheckboxProps> = ({
  saveAsTemplate,
  onChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={saveAsTemplate}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-gray-600">Save as Template</span>
    </div>
  );
};
