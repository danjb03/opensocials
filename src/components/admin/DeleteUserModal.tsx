
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteUser } from '@/hooks/admin/useDeleteUser';

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  userEmail?: string;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  open,
  onClose,
  userId,
  userEmail,
}) => {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = () => {
    if (userId) {
      deleteUserMutation.mutate(userId, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete User</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to permanently delete this user and all linked data?
            {userEmail && (
              <div className="mt-2 font-medium text-foreground">
                User: {userEmail}
              </div>
            )}
            <div className="mt-2 text-sm text-destructive">
              This action cannot be undone.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            className="border-border text-foreground hover:bg-accent"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;
