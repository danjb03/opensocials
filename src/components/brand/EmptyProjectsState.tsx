
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyProjectsStateProps {
  onCreateProject: () => void;
}

export const EmptyProjectsState = ({ onCreateProject }: EmptyProjectsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card">
      <div className="bg-card p-4 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">No projects yet</h3>
      <p className="text-foreground max-w-md mb-6">
        Get started by creating your first marketing campaign. Set up project details, budget, and campaign requirements.
      </p>
      <Button 
        onClick={onCreateProject}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 py-2"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create Your First Project
      </Button>
    </div>
  );
};
