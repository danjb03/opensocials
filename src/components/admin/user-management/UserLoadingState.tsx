
import React from 'react';
import { Loader } from 'lucide-react';

const UserLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center py-10">
      <Loader className="animate-spin h-6 w-6 text-foreground" />
    </div>
  );
};

export default UserLoadingState;
