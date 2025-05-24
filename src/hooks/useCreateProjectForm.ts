import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type CampaignType = 'single' | 'weekly' | 'monthly' | 'retainer' | '12-Month Retainer' | 'evergreen';

export const useCreateProjectForm = (onSuccess: (newProject: any) => void, userId: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    campaign_type: 'single' as CampaignType,
    start_date: '',
    end_date: '',
    budget: 0,
    currency: 'USD',
    content_requirements: {
      videos: { quantity: 0 },
      stories: { quantity: 0 },
      posts: { quantity: 0 }
    },
    platforms: [] as string[],
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

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'budget') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Campaign name is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast({
        title: 'Validation Error',
        description: 'Start and end dates are required',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('🚀 Starting project creation with data:', {
        ...formData,
        brand_id: userId,
        user_id: userId
      });

      // Prepare the data for insertion
      const projectData = {
        name: formData.name.trim(),
        campaign_type: formData.campaign_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget,
        currency: formData.currency,
        content_requirements: formData.content_requirements,
        platforms: formData.platforms,
        whitelisting: formData.whitelisting,
        exclusivity: formData.exclusivity || null,
        audience_focus: formData.audience_focus || null,
        campaign_objective: formData.campaign_objective,
        draft_approval: formData.draft_approval,
        submission_deadline: formData.submission_deadline || null,
        payment_structure: formData.payment_structure,
        description: formData.description || null,
        brand_id: userId,
        status: 'draft',
        is_template: formData.save_as_template
      };

      console.log('📝 Inserting project data:', projectData);

      const { data: insertedProject, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error('❌ Database insertion error:', error);
        throw error;
      }

      console.log('✅ Project created successfully:', insertedProject);

      // Verify the project was actually saved by querying it back
      const { data: verificationData, error: verificationError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', insertedProject.id)
        .single();

      if (verificationError) {
        console.error('❌ Verification query failed:', verificationError);
      } else {
        console.log('🔍 Verification: Project exists in database:', verificationData);
      }

      // Also check all projects for this user
      const { data: allProjects, error: allProjectsError } = await supabase
        .from('projects')
        .select('id, name, created_at, status')
        .eq('brand_id', userId)
        .order('created_at', { ascending: false });

      if (allProjectsError) {
        console.error('❌ Failed to fetch all projects:', allProjectsError);
      } else {
        console.log('📊 All projects for user:', allProjects);
      }

      toast({
        title: 'Campaign Created Successfully',
        description: `${formData.name} has been created and saved.`,
      });

      onSuccess(insertedProject);

    } catch (error: any) {
      console.error('💥 Project creation failed:', error);
      
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create campaign. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    showAdvanced,
    setShowAdvanced,
    handleChange,
    handleSubmit,
    loading
  };
};
