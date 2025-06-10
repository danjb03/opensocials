
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ArrowLeft, Save } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const EditCampaign = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setProject(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          start_date: data.start_date ? new Date(data.start_date) : null,
          end_date: data.end_date ? new Date(data.end_date) : null,
          budget: data.budget || '',
          campaign_type: data.campaign_type,
          platforms: data.platforms || [],
          whitelisting: data.whitelisting || false,
          draft_approval: data.draft_approval || true,
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Could not load project details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => {
      const currentPlatforms = [...(prev.platforms || [])];
      
      if (checked && !currentPlatforms.includes(platform)) {
        return { ...prev, platforms: [...currentPlatforms, platform] };
      }
      
      if (!checked && currentPlatforms.includes(platform)) {
        return { ...prev, platforms: currentPlatforms.filter(p => p !== platform) };
      }
      
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const updatedData = {
        name: formData.name,
        description: formData.description,
        start_date: formData.start_date ? format(formData.start_date, 'yyyy-MM-dd') : null,
        end_date: formData.end_date ? format(formData.end_date, 'yyyy-MM-dd') : null,
        budget: parseFloat(formData.budget) || project.budget,
        campaign_type: formData.campaign_type,
        platforms: formData.platforms,
        whitelisting: formData.whitelisting,
        draft_approval: formData.draft_approval,
      };

      const { error } = await supabase
        .from('projects')
        .update(updatedData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Campaign Updated',
        description: 'Campaign details have been successfully updated',
      });
      
      navigate(`/brand/projects/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Could not update campaign details',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl bg-background">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl bg-background">
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Project not found</h2>
              <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/brand/projects')}>
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    );
  }

  const platformOptions = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Facebook'];
  const campaignTypeOptions = ['Single', 'Weekly', 'Monthly', 'Retainer', 'Evergreen'];

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl bg-background">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(`/brand/projects/${id}`)} className="border-border text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Edit Campaign</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Campaign Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    className="bg-background border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaign_type" className="text-foreground">Campaign Type</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('campaign_type', value)}
                    value={formData.campaign_type}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypeOptions.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Campaign Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="bg-background border-border text-foreground"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-border",
                          !formData.start_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_date ? format(formData.start_date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.start_date}
                        onSelect={(date) => handleDateChange('start_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-foreground">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-border",
                          !formData.end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_date ? format(formData.end_date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.end_date}
                        onSelect={(date) => handleDateChange('end_date', date)}
                        disabled={(date) => date < (formData.start_date || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-foreground">Budget</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget || ''}
                    onChange={handleChange}
                    className="pl-7 bg-background border-border text-foreground"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-foreground">Platforms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platformOptions.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`platform-${platform}`}
                        checked={formData.platforms?.includes(platform.toLowerCase())}
                        onCheckedChange={(checked) => 
                          handlePlatformChange(platform.toLowerCase(), checked === true)
                        }
                      />
                      <label 
                        htmlFor={`platform-${platform}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                      >
                        {platform}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="whitelisting"
                    checked={formData.whitelisting || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('whitelisting', checked === true)
                    }
                  />
                  <label 
                    htmlFor="whitelisting"
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Require Whitelisting
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="draft_approval"
                    checked={formData.draft_approval || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('draft_approval', checked === true)
                    }
                  />
                  <label 
                    htmlFor="draft_approval"
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Require Draft Approval
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/brand/projects/${id}`)}
              disabled={saving}
              className="border-border text-foreground"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Changes'}
              {!saving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </BrandLayout>
  );
};

export default EditCampaign;
