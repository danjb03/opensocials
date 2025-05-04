
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyProjectsStateProps {
  onCreateProject: () => void;
}

export const EmptyProjectsState = ({ onCreateProject }: EmptyProjectsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
      <p className="text-gray-500 max-w-md mb-6">
        Get started by creating your first marketing campaign. Set up project details, budget, and campaign requirements.
      </p>
      <Button 
        onClick={onCreateProject}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create Your First Project
      </Button>
    </div>
  );
};
