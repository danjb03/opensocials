
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ProjectFormValues } from '@/types/project';

export const useCreateProjectForm = (onSuccess: (newProject: any) => void, userId: string) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    campaign_type: 'single' as const,
    start_date: '',
    end_date: '',
    budget: '',
    currency: 'USD' as const,
    content_requirements: {
      videos: { quantity: 0 },
      stories: { quantity: 0 },
      posts: { quantity: 0 }
    },
    platforms: [] as string[],
    usage_duration: '3_months' as const,
    whitelisting: false,
    exclusivity: '',
    audience_focus: '',
    campaign_objective: 'awareness' as const,
    draft_approval: true,
    submission_deadline: '',
    payment_structure: 'on_delivery' as const,
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target || {};
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare content requirements in the correct format
      const contentRequirements = {
        videos: formData.content_requirements.videos.quantity > 0 ? { quantity: formData.content_requirements.videos.quantity } : undefined,
        stories: formData.content_requirements.stories.quantity > 0 ? { quantity: formData.content_requirements.stories.quantity } : undefined,
        posts: formData.content_requirements.posts.quantity > 0 ? { quantity: formData.content_requirements.posts.quantity } : undefined
      };

      const payload = {
        brand_id: userId,
        name: formData.name,
        campaign_type: formData.campaign_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: parseFloat(formData.budget) || 0,
        currency: formData.currency,
        content_requirements: contentRequirements,
        platforms: formData.platforms,
        usage_duration: formData.usage_duration,
        whitelisting: formData.whitelisting,
        exclusivity: formData.exclusivity || null,
        audience_focus: formData.audience_focus || null,
        campaign_objective: formData.campaign_objective,
        draft_approval: formData.draft_approval,
        submission_deadline: formData.submission_deadline || null,
        payment_structure: formData.payment_structure,
        description: formData.description || null,
        status: 'draft'
      };

      const { error } = await supabase.from('projects').insert(payload);

      if (error) {
        toast({
          title: 'Project Creation Failed',
          description: error.message,
        });
      } else {
        toast({
          title: 'Project Created',
          description: `${formData.name} has been added.`,
        });
        onSuccess(payload);
      }

    } catch (err) {
      toast({
        title: 'Unexpected Error',
        description: 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    loading
  };
};
