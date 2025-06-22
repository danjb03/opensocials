
import React from 'react';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string | null;
}

export const CreatorProfileModal = ({ isOpen, onClose, creatorId }: CreatorProfileModalProps) => {
  if (!isOpen || !creatorId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Creator Profile</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">Creator details would be shown here.</p>
        </div>
      </div>
    </div>
  );
};
