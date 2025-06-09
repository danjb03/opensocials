import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleStatus } from '@/hooks/brand/useRoleStatus';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/sonner';
import { RoleDisplay } from '../RoleDisplay';

// Define a type for the allowed role values
type AppRole = Database['public']['Enums']['app_role'];

export default function UserRoleFixer() {
  const [userId, setUserId] = useState('af6ad2ce-be6c-4620-a440-867c52d66918');
  const [userRole, setUserRole] = useState<AppRole>('brand');
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [roleExists, setRoleExists] = useState<boolean | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  
  const { checkUserRoleExists, createUserRole } = useRoleStatus();

  // Check if user and role exist when component loads or userId changes
  useEffect(() => {
    const checkUserAndRole = async () => {
      setLoading(true);
      
      // Check if user exists in auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !userData?.user) {
        console.error('Error fetching user:', userError);
        setUserExists(false);
      } else {
        setUserExists(true);
        setUserDetails(userData.user);
        console.log('User found:', userData.user);
        
        // Check if role exists
        const roleExists = await checkUserRoleExists(userId);
        setRoleExists(roleExists);
        console.log('Role exists:', roleExists);
      }
      
      setLoading(false);
    };
    
    if (userId) {
      checkUserAndRole();
    }
  }, [userId]);

  // Secondary check to see if user has profile
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        console.log('Profile data:', data);
        if (data?.role) {
          setUserRole(data.role as AppRole);
        }
      }
    };
    
    checkUserProfile();
  }, [userId]);

  const handleCreateRole = async () => {
    setLoading(true);
    const success = await createUserRole(userId, userRole);
    if (success) {
      setRoleExists(true);
      toast.success(`Role ${userRole} created for user`);
    }
    setLoading(false);
  };

  const handleUpdateRole = async () => {
    setLoading(true);
    try {
      // First update the user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId,
          role: userRole,
          status: 'approved'
        }, { onConflict: 'user_id,role' });
        
      if (roleError) {
        throw new Error(`Failed to update user_roles: ${roleError.message}`);
      }
      
      // Then update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: userRole })
        .eq('id', userId);
        
      if (profileError) {
        throw new Error(`Failed to update profile: ${profileError.message}`);
      }
      
      toast.success(`User role updated to ${userRole}`);
      // Refresh roleExists state
      const roleExists = await checkUserRoleExists(userId);
      setRoleExists(roleExists);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(`Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Role Fixer</CardTitle>
        <CardDescription>
          Check and fix user roles in the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="userId">User ID</label>
          <Input 
            id="userId" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            placeholder="Enter user ID"
            className="w-full"
          />
        </div>
        
        {userExists === false && (
          <div className="text-red-500">
            User does not exist in auth.users table.
          </div>
        )}
        
        {userDetails && (
          <div className="bg-muted p-3 rounded-md space-y-2">
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Created:</strong> {new Date(userDetails.created_at).toLocaleString()}</p>
            {userDetails.user_metadata?.role && (
              <p><strong>Metadata Role:</strong> {userDetails.user_metadata.role}</p>
            )}
            {userId && (
              <div className="mt-2">
                <strong>Current Role: </strong>
                <RoleDisplay userId={userId} />
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="role">Role</label>
          <Select value={userRole} onValueChange={(value) => setUserRole(value as AppRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="agency">Agency</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {roleExists !== null && (
          <div className={roleExists ? "text-green-500" : "text-amber-500"}>
            {roleExists 
              ? "✅ User has a role in the user_roles table." 
              : "⚠️ User does not have a role in the user_roles table."}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        {!roleExists && (
          <Button 
            onClick={handleCreateRole} 
            disabled={loading || userExists === false} 
            className="w-full"
          >
            {loading ? "Creating..." : "Create Missing Role"}
          </Button>
        )}
        
        <Button 
          onClick={handleUpdateRole}
          disabled={loading || userExists === false}
          variant="default"
          className="w-full"
        >
          {loading ? "Updating..." : "Update Role"}
        </Button>
      </CardFooter>
    </Card>
  );
}
