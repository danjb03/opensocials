
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AgencyInviteUsers = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // This would typically send an invitation email
      // For now, just show a success message
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${email} for role: ${role}`,
      });
      setEmail('');
      setRole('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UserPlus className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Invite Users</h1>
        </div>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="managed_brand">Brand Manager</SelectItem>
                  <SelectItem value="managed_creator">Creator</SelectItem>
                  <SelectItem value="managed_user">General User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyInviteUsers;
