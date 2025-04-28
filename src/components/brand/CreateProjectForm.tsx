import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProjectForm } from '@/hooks/useCreateProjectForm';

type ProjectFormProps = {
  onSuccess: (newProject: any) => void;
  userId: string;
};

const CreateProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, userId }) => {
  const { formData, handleChange, handleSubmit, loading } = useCreateProjectForm(onSuccess, userId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="Project Name" value={formData.name} onChange={handleChange} required />

      <Select name="campaign_type" value={formData.campaign_type} onValueChange={(value) => handleChange({ target: { name: 'campaign_type', value } } as any)}>
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

      <Input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
      <Input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />

      <Input type="number" name="budget" placeholder="Budget" value={formData.budget} onChange={handleChange} required />

      <Textarea name="description" placeholder="Project Description" value={formData.description} onChange={handleChange} />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
};

export default CreateProjectForm;
