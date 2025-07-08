import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, User, Building, Globe, DollarSign } from 'lucide-react';

const BrandSettings = () => {
  const { user, brandProfile } = useUnifiedAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [bio, setBio] = useState('');
  const [goal, setGoal] = useState('');
  const [campaignFocus, setCampaignFocus] = useState<string[]>([]);

  // Load existing profile data
  useEffect(() => {
    if (brandProfile) {
      setCompanyName(brandProfile.company_name || '');
      setWebsite(brandProfile.website_url || '');
      setIndustry(brandProfile.industry || '');
      setBudgetRange(brandProfile.budget_range || '');
      setBio(brandProfile.brand_bio || '');
      setGoal(brandProfile.brand_goal || '');
      setCampaignFocus(brandProfile.campaign_focus || []);
    }
  }, [brandProfile]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('brand_profiles')
        .upsert({
          user_id: user.id,
          company_name: companyName,
          website_url: website,
          industry,
          budget_range: budgetRange,
          brand_bio: bio,
          brand_goal: goal,
          campaign_focus: campaignFocus,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating brand profile:', error);
        toast.error('Failed to save settings');
        return;
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving brand settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const industryOptions = [
    'Technology',
    'Fashion & Beauty',
    'Food & Beverage',
    'Health & Wellness',
    'Travel & Tourism',
    'Entertainment',
    'Sports & Fitness',
    'Education',
    'Finance',
    'Real Estate',
    'Automotive',
    'Home & Garden',
    'Other'
  ];

  const budgetOptions = [
    'Under $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Settings</h1>
          <p className="text-muted-foreground">
            Manage your brand profile and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget-range">Budget Range</Label>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Brand Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Brand Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your brand, values, and what makes you unique..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Brand Goals</Label>
              <Textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What are your main goals for influencer marketing campaigns?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email address
                </p>
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Input
                  value="Brand Account"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandSettings;
