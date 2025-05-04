
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleStatus } from '@/hooks/brand/useRoleStatus';
import { supabase } from '@/integrations/supabase/client';

export default function UserRoleFixer() {
  const [userId, setUserId] = useState('af6ad2ce-be6c-4620-a440-867c52d66918'); // Prefill with the user ID in question
  const [userRole, setUserRole] = useState('brand');
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
          setUserRole(data.role);
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
    }
    setLoading(false);
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
          <div className="bg-muted p-3 rounded-md">
            <p>Email: {userDetails.email}</p>
            <p>Created: {new Date(userDetails.created_at).toLocaleString()}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="role">Role</label>
          <Select value={userRole} onValueChange={setUserRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
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
      
      <CardFooter>
        <Button 
          onClick={handleCreateRole} 
          disabled={loading || userExists === false || roleExists === true} 
          className="w-full"
        >
          {loading ? "Checking..." : "Create Missing Role"}
        </Button>
      </CardFooter>
    </Card>
  );
}
