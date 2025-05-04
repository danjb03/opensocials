
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import Logo from '@/components/ui/logo';
import { ArrowLeft, Upload, X } from 'lucide-react';

const industries = [
  'Technology', 
  'Fashion', 
  'Food & Beverage', 
  'Beauty & Cosmetics', 
  'Health & Wellness',
  'Travel & Hospitality', 
  'Entertainment', 
  'Sports', 
  'Education', 
  'Finance',
  'Other'
];

const SetupProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Check for existing profile data
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching brand profile:', error);
          return;
        }
        
        if (data) {
          console.log('Found existing brand profile:', data);
          setExistingProfile(data);
          setCompanyName(data.company_name || '');
          setWebsite(data.website || '');
          setIndustry(data.industry || '');
          setLogoUrl(data.logo_url || null);
        }
      } catch (error) {
        console.error('Error checking brand profile:', error);
      }
    };
    
    checkExistingProfile();
  }, [user]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
  };

  const clearLogo = () => {
    setLogoFile(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setLogoUrl(null);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user) return null;
    
    try {
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `${user.id}/logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, logoFile);

      if (error) {
        throw error;
      }
      
      const { data: urlData } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo.');
      return null;
    }
  };

  // Update user role status to approved
  const updateUserRoleStatus = async (userId: string) => {
    try {
      console.log('Updating user role status for:', userId);
      const { error } = await supabase
        .from('user_roles')
        .update({ status: 'approved' })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Failed to update user role status:', error);
        return false;
      }
      console.log('User role status updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user role status:', error);
      return false;
    }
  };

  const handleSkipForNow = async () => {
    if (!user) {
      toast.error('You must be logged in to continue');
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Just update the minimal required fields
      const profileData = {
        company_name: companyName || 'My Brand',
        is_complete: true,
        role: 'brand'
      };
      
      console.log("Updating minimal profile data:", profileData);
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
          
      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }
      
      // Update user role status to approved
      await updateUserRoleStatus(user.id);
      console.log("User role status updated to approved");
      
      toast.success('Welcome to your brand dashboard!');
      
      // Force navigation to brand dashboard with a flag to bypass guards
      console.log("Navigating to brand dashboard");
      window.localStorage.setItem('bypass_brand_check', 'true');
      setTimeout(() => {
        navigate('/brand');
        setTimeout(() => {
          window.location.href = '/brand';
        }, 500);
      }, 100);
    } catch (error: any) {
      console.error('Error skipping profile setup:', error);
      toast.error('Failed to continue: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to complete profile setup');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    console.log("Starting profile setup submission");

    try {
      // Upload logo if one was selected
      let uploadedLogoUrl = null;
      if (logoFile) {
        uploadedLogoUrl = await uploadLogo();
        console.log("Logo uploaded:", uploadedLogoUrl);
      }
      
      const profileData = {
        company_name: companyName,
        website: website || null,
        industry: industry || null,
        logo_url: uploadedLogoUrl || logoUrl,
        is_complete: true,
        role: 'brand'
      };
      
      console.log("Updating profile with data:", profileData);
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
          
      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }
      
      console.log("Profile updated successfully");
      
      // Update user role status to approved
      await updateUserRoleStatus(user.id);
      console.log("User role status updated to approved");
      
      toast.success('Profile setup complete!');
      
      // Force navigation with multiple fallbacks
      console.log("Attempting to navigate to /brand");
      window.localStorage.setItem('bypass_brand_check', 'true');
      
      // Try different navigation methods as fallbacks
      setTimeout(() => {
        try {
          navigate('/brand', { replace: true });
          console.log("First navigation attempt complete");
          
          // Fallback: direct location change
          setTimeout(() => {
            console.log("Using fallback navigation");
            window.location.href = '/brand';
          }, 300);
        } catch (navError) {
          console.error("Navigation error:", navError);
          window.location.href = '/brand';
        }
      }, 100);
    } catch (error: any) {
      console.error('Error setting up profile:', error);
      toast.error('Failed to set up profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Set Up Your Brand Profile</h1>
          <p className="text-muted-foreground">Complete your profile to get started</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
            <CardDescription>
              Tell us about your brand to help creators understand who you are
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input 
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  {(logoPreview || logoUrl) && (
                    <div className="relative">
                      <img 
                        src={logoPreview || logoUrl || ''} 
                        alt="Logo preview" 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                        onClick={clearLogo}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {!(logoPreview || logoUrl) && (
                    <div className="relative">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="logo"
                        className="flex items-center gap-2 p-2 border border-dashed rounded-md cursor-pointer hover:bg-accent"
                      >
                        <Upload size={20} />
                        <span>Upload Logo</span>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://your-company.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipForNow}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <ArrowLeft size={16} /> Skip for now
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupProfile;
