
import React from 'react';

interface UserErrorStateProps {
  error: Error;
}

const UserErrorState: React.FC<UserErrorStateProps> = ({ error }) => {
  return (
    <div className="text-destructive-foreground text-center py-6">
      <p>Failed to load users. Please try again later.</p>
      <p className="text-sm mt-2">Error: {error.message}</p>
    </div>
  );
};

export default UserErrorState;
