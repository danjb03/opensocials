import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return true;
    return !isNaN(Date.parse(dateString));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({ title: 'Missing Fields', description: 'Please enter a project name.' });
      return;
    }

    if (formData.start_date && !validateDate(formData.start_date)) {
      toast({ title: 'Invalid Date', description: 'Please enter a valid start date.' });
      return;
    }

    if (formData.end_date && !validateDate(formData.end_date)) {
      toast({ title: 'Invalid Date', description: 'Please enter a valid end date.' });
      return;
    }

    if (formData.submission_deadline && !validateDate(formData.submission_deadline)) {
      toast({ title: 'Invalid Date', description: 'Please enter a valid submission deadline.' });
      return;
    }

    setLoading(true);

    try {
      const contentRequirements: any = {};
      if (formData.content_requirements.videos.quantity > 0) {
        contentRequirements.videos = { quantity: formData.content_requirements.videos.quantity };
      }
      if (formData.content_requirements.stories.quantity > 0) {
        contentRequirements.stories = { quantity: formData.content_requirements.stories.quantity };
      }
      if (formData.content_requirements.posts.quantity > 0) {
        contentRequirements.posts = { quantity: formData.content_requirements.posts.quantity };
      }

      const payload = {
        brand_id: userId,
        name: formData.name,
        campaign_type: formData.campaign_type,
        start_date: formData.start_date?.trim() ? formData.start_date : null,
        end_date: formData.end_date?.trim() ? formData.end_date : null,
        budget: parseFloat(formData.budget) || 0,
        currency: formData.currency,
        content_requirements: Object.keys(contentRequirements).length ? contentRequirements : null,
        platforms: formData.platforms,
        usage_duration: formData.usage_duration || null,
        whitelisting: formData.whitelisting,
        exclusivity: formData.exclusivity || null,
        audience_focus: formData.audience_focus || null,
        campaign_objective: formData.campaign_objective,
        draft_approval: formData.draft_approval,
        submission_deadline: formData.submission_deadline?.trim() ? formData.submission_deadline : null,
        payment_structure: formData.payment_structure,
        description: formData.description || null,
        status: 'draft'
      };

      const { error } = await supabase.from('projects').insert(payload);

      if (error) {
        console.error('Error creating project:', error);
        toast({
          title: 'Project Creation Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Project Created',
          description: `${formData.name} has been added.`,
        });
        onSuccess(payload);
      }

    } catch (err) {
      console.error('Unexpected error during project creation:', err);
      toast({
        title: 'Unexpected Error',
        description: 'Something went wrong.',
        variant: 'destructive',
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
