
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronUp } from 'lucide-react';

const contentOptions = ['TikTok Video', 'Instagram Reel', 'YouTube Short', 'Carousel Post', 'Instagram Story', 'Live Stream', 'Blog Post'];
const platformOptions = ['TikTok', 'Instagram', 'YouTube', 'Twitter', 'Facebook'];

const CreateProjectForm = ({ onSuccess, userId }) => {
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    campaign_type: ['Monthly'],
    start_date: '',
    end_date: '',
    budget: 0,
    currency: 'USD',
    content_requirements: [],
    platforms: [],
    usage_duration: '',
    whitelisting: false,
    exclusivity: '',
    audience_focus: '',
    campaign_objective: 'awareness',
    draft_approval: true,
    submission_deadline: '',
    payment_structure: 'on_delivery',
    description: '',
    save_as_template: false
  });

  const handleAddContentType = () => {
    setFormData(prev => ({
      ...prev,
      content_requirements: [...prev.content_requirements, { type: '', quantity: 1 }]
    }));
  };

  const handleContentChange = (index, field, value) => {
    const updated = [...formData.content_requirements];
    updated[index][field] = value;
    setFormData({ ...formData, content_requirements: updated });
  };

  const handlePlatformSelect = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const validateDates = () => {
    if (!formData.start_date) {
      toast({
        title: 'Missing Fields',
        description: 'Please select a start date.',
        variant: 'destructive'
      });
      return false;
    }
    
    if (!formData.end_date) {
      toast({
        title: 'Missing Fields',
        description: 'Please select an end date.',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast({ 
        title: 'Missing Fields', 
        description: 'Please enter a project name.', 
        variant: 'destructive' 
      });
      return;
    }

    if (!validateDates()) {
      return;
    }

    const { save_as_template, ...cleanFormData } = formData;

    const payload = {
      ...cleanFormData,
      campaign_type: formData.campaign_type.join(', '),
      brand_id: userId,
      status: 'draft',
      is_template: save_as_template
    };

    console.log('Submitting project with payload:', payload);

    const { error } = await supabase.from('projects').insert([payload]);

    if (error) {
      console.error('Error creating project:', error);
      toast({ 
        title: 'Project Creation Failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    } else {
      toast({ 
        title: '🚀 Campaign Created', 
        description: `${formData.name} is now saved.` 
      });
      onSuccess(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">Create New Project</h2>

      <Input 
        placeholder="Project Name" 
        value={formData.name} 
        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
        required 
      />

      <div>
        <p className="font-medium mb-2">Campaign Type</p>
        <div className="flex flex-wrap gap-2">
          {['Single', 'Weekly', 'Monthly', '12-Month Retainer', 'Evergreen'].map(option => (
            <Button
              type="button"
              key={option}
              variant={formData.campaign_type.includes(option) ? 'default' : 'outline'}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  campaign_type: prev.campaign_type.includes(option)
                    ? prev.campaign_type.filter(t => t !== option)
                    : [...prev.campaign_type, option]
                }));
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input 
            type="date" 
            value={formData.start_date} 
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
            required 
            className="w-full"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input 
            type="date" 
            value={formData.end_date} 
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
            required 
            className="w-full"
          />
        </div>
      </div>

      <Input 
        type="number" 
        placeholder="Budget" 
        value={formData.budget} 
        onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })} 
        required 
      />

      <div>
        <p className="font-medium mb-2">Content Requirements</p>
        {formData.content_requirements.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select value={item.type} onChange={(e) => handleContentChange(index, 'type', e.target.value)} className="flex-1 border p-2 rounded">
              <option value="">Select Content Type</option>
              {contentOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Input type="number" value={item.quantity} min={1} onChange={(e) => handleContentChange(index, 'quantity', parseInt(e.target.value))} className="w-24" />
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={handleAddContentType}>+ Add Content Type</Button>
      </div>

      <div>
        <p className="font-medium mb-2">Platforms</p>
        <div className="flex flex-wrap gap-2">
          {platformOptions.map(platform => (
            <Button
              type="button"
              key={platform}
              variant={formData.platforms.includes(platform) ? 'default' : 'outline'}
              onClick={() => handlePlatformSelect(platform)}
            >
              {platform}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <p className="font-medium mb-2">Whitelisting</p>
          <Button type="button" variant={formData.whitelisting ? 'default' : 'outline'} onClick={() => setFormData({ ...formData, whitelisting: !formData.whitelisting })}>
            {formData.whitelisting ? 'Yes' : 'No'}
          </Button>
        </div>
        <div>
          <p className="font-medium mb-2">Exclusivity</p>
          <Input placeholder="e.g. 3 months" value={formData.exclusivity} onChange={(e) => setFormData({ ...formData, exclusivity: e.target.value })} />
        </div>
      </div>

      <Button type="button" variant="ghost" onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />} Additional Details
      </Button>

      {showAdvanced && (
        <Textarea placeholder="Add posting times, hashtag guidelines, tone of voice..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      )}

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={formData.save_as_template} onChange={(e) => setFormData({ ...formData, save_as_template: e.target.checked })} />
        <span>Save as Template</span>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
        🚀 Launch Campaign
      </Button>
    </form>
  );
};

export default CreateProjectForm;
