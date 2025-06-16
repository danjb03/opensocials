import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader, Save, X, Pause, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

interface UserEditModalProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

const UserEditModal = ({ userId, open, onClose }: UserEditModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as User;
    },
    enabled: !!userId && open,
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!userId) throw new Error('No user ID provided');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-details', userId] });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('No user ID provided');
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User account suspended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-details', userId] });
    },
    onError: (error) => {
      console.error('Error suspending user:', error);
      toast({
        title: "Error",
        description: "Failed to suspend user account.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('No user ID provided');
      
      // First delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) throw profileError;

      // Then delete from auth.users using admin function
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (Object.keys(editData).length > 0) {
      updateUserMutation.mutate(editData);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof User, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuspendUser = () => {
    if (window.confirm('Are you sure you want to suspend this user account? They will not be able to log in until reactivated.')) {
      suspendUserMutation.mutate();
    }
  };

  const handleDeleteUser = () => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate();
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'brand': return 'secondary';
      case 'creator': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-12">
            User Details
            {user && !isEditing && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit User
                </Button>
                {user.status !== 'suspended' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSuspendUser}
                    disabled={suspendUserMutation.isPending}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDeleteUser}
                  disabled={deleteUserMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        )}

        {user && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.first_name ?? user.first_name ?? ''}
                    onChange={(e) => handleFieldChange('first_name', e.target.value)}
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">
                    {user.first_name || 'Not set'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.last_name ?? user.last_name ?? ''}
                    onChange={(e) => handleFieldChange('last_name', e.target.value)}
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">
                    {user.last_name || 'Not set'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-muted rounded">
                {user.email || 'Not set'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                {isEditing ? (
                  <Select
                    value={editData.role ?? user.role ?? ''}
                    onValueChange={(value) => handleFieldChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role || 'No role'}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                {isEditing ? (
                  <Select
                    value={editData.status ?? user.status ?? ''}
                    onValueChange={(value) => handleFieldChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center">
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status || 'Unknown'}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Created At</Label>
              <div className="p-2 bg-muted rounded">
                {user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown'}
              </div>
            </div>

            <div className="space-y-2">
              <Label>User ID</Label>
              <div className="p-2 bg-muted rounded font-mono text-sm">
                {user.id}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={updateUserMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? (
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
