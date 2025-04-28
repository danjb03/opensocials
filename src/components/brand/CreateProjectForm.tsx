
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProjectForm } from '@/hooks/useCreateProjectForm';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ProjectFormProps = {
  onSuccess: (newProject: any) => void;
  userId: string;
};

const CreateProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, userId }) => {
  const { formData, setFormData, handleChange, handleSubmit, loading } = useCreateProjectForm(onSuccess, userId);
  const { toast } = useToast();

  const handleContentQuantityChange = (type: 'videos' | 'stories' | 'posts', value: number) => {
    setFormData(prev => ({
      ...prev,
      content_requirements: {
        ...prev.content_requirements,
        [type]: { quantity: value }
      }
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];

      return { ...prev, platforms };
    });
  };

  const isValidDate = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return true; // Skip validation if either date is empty
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return start <= end;
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidDate(formData.start_date, formData.end_date)) {
      toast({
        title: "Invalid Dates",
        description: "End date cannot be before start date",
      });
      return;
    }
    
    handleSubmit(e);
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content Requirements</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>
      
        <TabsContent value="basic" className="space-y-4">
          <Input 
            name="name" 
            placeholder="Project Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />

          <Select 
            name="campaign_type" 
            value={formData.campaign_type} 
            onValueChange={(value) => handleChange({ target: { name: 'campaign_type', value } } as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Campaign Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="retainer_12m">12-Month Retainer</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input 
                id="start_date"
                type="date" 
                name="start_date" 
                value={formData.start_date} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input 
                id="end_date"
                type="date" 
                name="end_date" 
                value={formData.end_date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input 
                id="budget"
                type="number" 
                name="budget" 
                placeholder="Budget amount" 
                value={formData.budget} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                name="currency" 
                value={formData.currency} 
                onValueChange={(value) => handleChange({ target: { name: 'currency', value } } as any)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description"
              name="description" 
              placeholder="Describe the project..." 
              value={formData.description} 
              onChange={handleChange} 
              className="min-h-[100px]"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Requirements</CardTitle>
              <CardDescription>Specify how many of each content type are needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="videos">Videos</Label>
                  <span className="text-sm font-medium">
                    {formData.content_requirements.videos.quantity}
                  </span>
                </div>
                <Slider
                  id="videos"
                  min={0}
                  max={20}
                  step={1}
                  value={[formData.content_requirements.videos.quantity]}
                  onValueChange={(value) => handleContentQuantityChange('videos', value[0])}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="stories">Stories</Label>
                  <span className="text-sm font-medium">
                    {formData.content_requirements.stories.quantity}
                  </span>
                </div>
                <Slider
                  id="stories"
                  min={0}
                  max={20} 
                  step={1}
                  value={[formData.content_requirements.stories.quantity]}
                  onValueChange={(value) => handleContentQuantityChange('stories', value[0])}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="posts">Posts</Label>
                  <span className="text-sm font-medium">
                    {formData.content_requirements.posts.quantity}
                  </span>
                </div>
                <Slider
                  id="posts"
                  min={0}
                  max={20}
                  step={1}
                  value={[formData.content_requirements.posts.quantity]}
                  onValueChange={(value) => handleContentQuantityChange('posts', value[0])}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platforms</CardTitle>
              <CardDescription>Select all platforms where content will be published</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter', 'LinkedIn'].map(platform => (
                  <Button
                    key={platform}
                    type="button"
                    variant={formData.platforms.includes(platform) ? "default" : "outline"}
                    onClick={() => handlePlatformToggle(platform)}
                    className="justify-start"
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="usage_duration">Usage Duration</Label>
                <Select 
                  name="usage_duration" 
                  value={formData.usage_duration} 
                  onValueChange={(value) => handleChange({ target: { name: 'usage_duration', value } } as any)}
                >
                  <SelectTrigger id="usage_duration">
                    <SelectValue placeholder="Select usage duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3_months">3 Months</SelectItem>
                    <SelectItem value="12_months">12 Months</SelectItem>
                    <SelectItem value="perpetual">Perpetual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="whitelisting"
                  checked={formData.whitelisting} 
                  onCheckedChange={(checked) => handleChange({ target: { name: 'whitelisting', checked, type: 'checkbox' } } as any)} 
                />
                <Label htmlFor="whitelisting">Whitelisting Required</Label>
              </div>
              
              <div>
                <Label htmlFor="exclusivity">Exclusivity Terms (Optional)</Label>
                <Textarea 
                  id="exclusivity"
                  name="exclusivity" 
                  placeholder="Enter exclusivity terms..." 
                  value={formData.exclusivity} 
                  onChange={handleChange} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audience_focus">Target Audience</Label>
                <Textarea 
                  id="audience_focus"
                  name="audience_focus" 
                  placeholder="Describe the target audience..." 
                  value={formData.audience_focus} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="campaign_objective">Campaign Objective</Label>
                <Select 
                  name="campaign_objective" 
                  value={formData.campaign_objective} 
                  onValueChange={(value) => handleChange({ target: { name: 'campaign_objective', value } } as any)}
                >
                  <SelectTrigger id="campaign_objective">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="draft_approval"
                  checked={formData.draft_approval} 
                  onCheckedChange={(checked) => handleChange({ target: { name: 'draft_approval', checked, type: 'checkbox' } } as any)} 
                />
                <Label htmlFor="draft_approval">Draft Approval Required</Label>
              </div>
              
              <div>
                <Label htmlFor="submission_deadline">Submission Deadline (Optional)</Label>
                <Input 
                  id="submission_deadline"
                  type="date" 
                  name="submission_deadline" 
                  value={formData.submission_deadline} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="payment_structure">Payment Structure</Label>
                <Select 
                  name="payment_structure" 
                  value={formData.payment_structure} 
                  onValueChange={(value) => handleChange({ target: { name: 'payment_structure', value } } as any)}
                >
                  <SelectTrigger id="payment_structure">
                    <SelectValue placeholder="Select payment structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upfront">Upfront</SelectItem>
                    <SelectItem value="50_50">50/50 Split</SelectItem>
                    <SelectItem value="on_delivery">On Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
};

export default CreateProjectForm;
