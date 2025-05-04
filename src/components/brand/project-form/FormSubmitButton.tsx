
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormSubmitButtonProps {
  loading: boolean;
  label?: string;
  loadingLabel?: string;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  loading,
  label = '🚀 Launch Campaign',
  loadingLabel = 'Creating...'
}) => {
  return (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-medium py-3 shadow-md hover:shadow-lg transition-all"
      disabled={loading}
    >
      {loading ? loadingLabel : label}
    </Button>
  );
};
