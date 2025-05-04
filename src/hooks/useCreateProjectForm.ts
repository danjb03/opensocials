
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

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return true; // Empty dates will be converted to null
    // Basic date format validation
    return !isNaN(Date.parse(dateString));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name) {
      toast({
        title: 'Missing Fields',
        description: 'Please enter a project name.',
      });
      return;
    }
    
    // Validate dates if provided
    if (formData.start_date && !validateDate(formData.start_date)) {
      toast({
        title: 'Invalid Date',
        description: 'Please enter a valid start date.',
      });
      return;
    }
    
    if (formData.end_date && !validateDate(formData.end_date)) {
      toast({
        title: 'Invalid Date',
        description: 'Please enter a valid end date.',
      });
      return;
    }

    if (formData.submission_deadline && !validateDate(formData.submission_deadline)) {
      toast({
        title: 'Invalid Date',
        description: 'Please enter a valid submission deadline.',
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

      // Ensure empty date strings are set to null
      const start_date = formData.start_date ? formData.start_date : null;
      const end_date = formData.end_date ? formData.end_date : null;
      const submission_deadline = formData.submission_deadline ? formData.submission_deadline : null;

      const payload = {
        brand_id: userId,
        name: formData.name,
        campaign_type: formData.campaign_type,
        start_date: start_date,
        end_date: end_date,
        budget: parseFloat(formData.budget) || 0,
        currency: formData.currency,
        content_requirements: contentRequirements,
        platforms: formData.platforms,
        usage_duration: formData.usage_duration || null,
        whitelisting: formData.whitelisting,
        exclusivity: formData.exclusivity || null,
        audience_focus: formData.audience_focus || null,
        campaign_objective: formData.campaign_objective,
        draft_approval: formData.draft_approval,
        submission_deadline: submission_deadline,
        payment_structure: formData.payment_structure,
        description: formData.description || null,
        status: 'draft'
      };

      console.log('Submitting project with payload:', payload);
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
