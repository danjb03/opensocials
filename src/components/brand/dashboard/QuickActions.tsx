
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button 
        className="flex items-center gap-2"
        onClick={() => navigate('/brand/projects?action=create')}
      >
        <Plus className="h-4 w-4" />
        Create New Project
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => navigate('/brand/orders')}
      >
        <FileText className="h-4 w-4" />
        View Proposals
      </Button>
    </div>
  );
};

export default QuickActions;
