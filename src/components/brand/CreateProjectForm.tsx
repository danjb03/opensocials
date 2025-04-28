// src/components/brand/CreateProjectForm.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const steps = ['Basics', 'Content', 'Legal & Launch'];

const ProjectWizard = ({ onSuccess, userId }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [useTemplate, setUseTemplate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    campaign_type: ['Monthly'],
    start_date: '',
    end_date: '',
    budget: 0,
    currency: 'USD',
    content_requirements: [],
    usage_duration: '',
    whitelisting: false,
    exclusivity: '',
    description: '',
    save_as_template: false
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase.from('projects').select('*').eq('is_template', true).eq('brand_id', userId);
      setTemplates(data || []);
    };
    fetchTemplates();
  }, [userId]);

  const applyTemplate = (template) => {
    const { id, is_template, created_at, ...rest } = template;
    setFormData({ ...rest, save_as_template: false });
    toast({ title: 'Template Loaded', description: `${template.name} applied.` });
    setCurrentStep(0);
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const payload = { ...formData, brand_id: userId, status: 'draft', is_template: formData.save_as_template };
    const { error } = await supabase.from('projects').insert([payload]);

    if (error) {
      toast({ title: 'Failed to Launch', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🚀 Campaign Launched', description: `${formData.name} is live.` });
      onSuccess(payload);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Create New Project</h2>

      {/* Template Selection */}
      {templates.length > 0 && !useTemplate && (
        <div className="space-y-2">
          <p className="font-medium">Use a Saved Template?</p>
          {templates.map(t => (
            <Button key={t.id} variant="secondary" onClick={() => { setUseTemplate(true); applyTemplate(t); }}>
              {t.name}
            </Button>
          ))}
          <Button variant="ghost" onClick={() => setUseTemplate(true)}>Start from Scratch</Button>
        </div>
      )}

      {/* Multi-Step Form */}
      {useTemplate && (
        <div>
          <div className="mb-4">Step {currentStep + 1} of {steps.length}: <strong>{steps[currentStep]}</strong></div>

          {currentStep === 0 && (
            <Input placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          )}

          {currentStep === 1 && (
            <Button onClick={() => setFormData({ ...formData, content_requirements: [...formData.content_requirements, { type: '', quantity: 1 }] })}>
              + Add Content Requirement
            </Button>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Textarea placeholder="Additional Details" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.save_as_template} onChange={(e) => setFormData({ ...formData, save_as_template: e.target.checked })} />
                <span>Save as Template</span>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 0 && <Button onClick={handleBack}>Back</Button>}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white" onClick={handleSubmit}>🚀 Launch Campaign</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWizard;
