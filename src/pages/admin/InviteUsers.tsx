
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader, Send, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteLog {
  id: string;
  email: string;
  role: string;
  status: string;
  sent_at: string;
  error_message?: string;
}

const InviteUsers = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  const { data: inviteLogs = [], isLoading, refetch } = useQuery({
    queryKey: ['invite-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invite_logs')
        .select('*')
        .order('sent_at', { ascending: false });
      
      if (error) throw error;
      return data as InviteLog[];
    },
  });

  const handleInvite = async () => {
    if (!email || !role) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both email and role.',
        variant: 'destructive',
      });
      return;
    }

    setIsInviting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: { email, role }
      });

      if (error) throw error;

      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${email} as ${role}.`,
      });

      setEmail('');
      setRole('');
      refetch();
    } catch (error) {
      console.error('Invite error:', error);
      toast({
        title: 'Failed to Send Invitation',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsInviting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Invite Users</h1>
        <p className="text-muted-foreground">Send invitations to new users and track invitation status.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Invitation
            </CardTitle>
            <CardDescription>
              Invite new users to join the platform with specific roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleInvite} 
              disabled={isInviting || !email || !role}
              className="w-full"
            >
              {isInviting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invitations</CardTitle>
            <CardDescription>
              Track the status of recently sent invitations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader className="animate-spin h-6 w-6" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inviteLogs.slice(0, 5).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(log.status)}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(log.sent_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InviteUsers;
