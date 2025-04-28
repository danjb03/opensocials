
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';  // Updated import path
import { ChevronDown, ChevronUp } from 'lucide-react';

type ProjectFormProps = {
  onSuccess: (newProject: any) => void;
  userId: string;
};

const contentOptions = ['TikTok Video', 'Instagram Reel', 'YouTube Short', 'Carousel Post', 'Instagram Story', 'Live Stream', 'Blog Post'];

const CreateProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, userId }) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    campaign_type: ['Monthly'],
    start_date: '',
    end_date: '',
    budget: 0,
    currency: 'USD',
    content_requirements: [] as { type: string; quantity: number }[],
    usage_duration: '',
    whitelisting: false,
    exclusivity: '',
    description: '',
    showAdvanced: false
  });

  const handleAddContentType = () => {
    setFormData(prev => ({
      ...prev,
      content_requirements: [...prev.content_requirements, { type: '', quantity: 1 }]
    }));
  };

  const handleContentChange = (index: number, field: string, value: any) => {
    const updated = [...formData.content_requirements];
    updated[index][field] = value;
    setFormData({ ...formData, content_requirements: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      brand_id: userId,
      name: formData.name,
      campaign_type: formData.campaign_type.join(', '),
      start_date: formData.start_date,
      end_date: formData.end_date,
      budget: formData.budget,
      currency: formData.currency,
      content_requirements: formData.content_requirements,
      usage_duration: formData.usage_duration,
      whitelisting: formData.whitelisting,
      exclusivity: formData.exclusivity,
      description: formData.description,
      status: 'draft'
    };

    const { error } = await supabase.from('projects').insert([payload]);

    if (error) {
      toast({ title: 'Project Creation Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🚀 Campaign Launched', description: `${formData.name} is now active.` });
      onSuccess(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input name="name" placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

      <div>
        <label className="block mb-2 font-medium">Campaign Type</label>
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
        <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
        <Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
      </div>

      <Input type="number" placeholder="Budget" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })} required />

      <div>
        <label className="block mb-2 font-medium">Content Requirements</label>
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

      <div className="flex gap-4">
        <div>
          <label className="block mb-2 font-medium">Whitelisting</label>
          <Button type="button" variant={formData.whitelisting ? 'default' : 'outline'} onClick={() => setFormData({ ...formData, whitelisting: !formData.whitelisting })}>
            {formData.whitelisting ? 'Yes' : 'No'}
          </Button>
        </div>
        <div>
          <label className="block mb-2 font-medium">Exclusivity</label>
          <Input placeholder="e.g. 3 months" value={formData.exclusivity} onChange={(e) => setFormData({ ...formData, exclusivity: e.target.value })} />
        </div>
      </div>

      <div>
        <Button type="button" variant="ghost" onClick={() => setFormData({ ...formData, showAdvanced: !formData.showAdvanced })}>
          {formData.showAdvanced ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
          Additional Details
        </Button>
        {formData.showAdvanced && (
          <Textarea placeholder="Add posting times, hashtag guidelines, tone of voice..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        )}
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
        🚀 Launch Campaign
      </Button>
    </form>
  );
};

export default CreateProjectForm;
