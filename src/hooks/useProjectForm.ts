
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProjectForm = (onSuccess: (newProject: any) => void, userId: string) => {
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

  return {
    formData,
    setFormData,
    showAdvanced,
    setShowAdvanced,
    handleAddContentType,
    handleContentChange,
    handlePlatformSelect,
    handleSubmit
  };
};
