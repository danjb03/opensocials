import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, FileText, Shield, Trash2, User, Database, Eye, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const DataDeletionPage = () => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [deletionReason, setDeletionReason] = useState('');
  const [understandTerms, setUnderstandTerms] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);

  const { data: userData, isLoading: isUserDataLoading, error: userDataError } = useQuery(
    ['user-data', user?.id],
    async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
      return data;
    },
    {
      enabled: !!user?.id,
    }
  );

  useEffect(() => {
    if (deletionConfirmed) {
      const timeoutId = setTimeout(() => {
        navigate('/auth');
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [deletionConfirmed, navigate]);

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error('No user session found. Please sign in again.');
      return;
    }

    if (!deletionReason) {
      toast.error('Please provide a reason for deleting your account.');
      return;
    }

    if (!understandTerms) {
      toast.error('Please confirm that you understand the data deletion terms.');
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Delete user data from Supabase tables
      const tablesToDelete = [
        'brand_profiles',
        'creator_profiles',
        'user_profiles',
        'campaign_favorites',
        'campaign_invites',
        'campaign_responses',
        'campaign_views',
        'creator_favorites',
        'creator_views',
        'project_invites',
        'project_responses',
        'project_views',
        'projects',
        'projects_new',
        'user_settings',
        'user_social_accounts',
        'creator_public_analytics'
      ];

      for (const table of tablesToDelete) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          console.error(`Error deleting from ${table}:`, deleteError);
          toast.error(`Failed to delete data from ${table}. Please try again.`);
          setIsDeleting(false);
          return;
        }
        console.log(`Deleted data from ${table} for user ${user.id}`);
      }

      // 2. Delete the user account from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

      if (authError) {
        console.error('Error deleting user from auth:', authError);
        toast.error('Failed to delete your account. Please contact support.');
        setIsDeleting(false);
        return;
      }

      console.log(`User ${user.id} deleted from auth`);

      // 3. Sign the user out
      await supabase.auth.signOut();

      // 4. Set deletion confirmed state
      setDeletionConfirmed(true);
      toast.success('Your account has been successfully deleted. Redirecting to the homepage...');

    } catch (error) {
      console.error('Error during account deletion:', error);
      toast.error('An unexpected error occurred during account deletion. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (deletionConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account Deletion Successful</h2>
        <p className="text-gray-600 text-center">
          Your account has been successfully deleted. You will be redirected to the homepage in a few seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-red-500" />
            Delete Your Account
          </CardTitle>
          <p className="text-gray-600">
            This action is permanent and will delete all your data. Please proceed with caution.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* User Data Summary */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              Your Information
            </h3>
            {isUserDataLoading ? (
              <p className="text-gray-500">Loading user data...</p>
            ) : userDataError ? (
              <p className="text-red-500">Error loading user data.</p>
            ) : userData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email:</p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Full Name:</p>
                  <p className="text-gray-600">{userData.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Created At:</p>
                  <p className="text-gray-600">{new Date(user?.created_at || '').toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Updated:</p>
                  <p className="text-gray-600">{new Date(userData.updated_at || '').toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No user data found.</p>
            )}
          </div>

          <Separator />

          {/* Data Deletion Details */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-500" />
              Data Deletion Details
            </h3>
            <p className="text-gray-700">
              Upon account deletion, the following data will be permanently removed:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Your profile information (name, email, etc.)</li>
              <li>All your created content and associated data</li>
              <li>Any connected social media accounts</li>
              <li>All your settings and preferences</li>
            </ul>
          </div>

          <Separator />

          {/* Confirmation Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirmation
            </h3>

            {/* Deletion Reason */}
            <div className="space-y-2">
              <Label htmlFor="deletion-reason" className="text-gray-700">
                Reason for Deletion
              </Label>
              <Textarea
                id="deletion-reason"
                placeholder="Please tell us why you are deleting your account."
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={understandTerms}
                onCheckedChange={setUnderstandTerms}
              />
              <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-gray-700">
                I understand that this action is permanent and all my data will be deleted.
              </Label>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Confirm Delete Account
                </>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default DataDeletionPage;
