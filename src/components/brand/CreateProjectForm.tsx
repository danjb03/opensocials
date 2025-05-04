
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useProjectForm } from '@/hooks/useProjectForm';
import { CampaignTypeSelector } from './project-form/CampaignTypeSelector';
import { ContentRequirements } from './project-form/ContentRequirements';
import { PlatformSelector } from './project-form/PlatformSelector';
import { DateRangeSelector } from './project-form/DateRangeSelector';

const CreateProjectForm = ({ onSuccess, userId }) => {
  const {
    formData,
    setFormData,
    showAdvanced,
    setShowAdvanced,
    handleAddContentType,
    handleContentChange,
    handlePlatformSelect,
    handleSubmit
  } = useProjectForm(onSuccess, userId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">Create New Project</h2>

      <Input 
        placeholder="Project Name" 
        value={formData.name} 
        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
        required 
      />

      <CampaignTypeSelector 
        selectedTypes={formData.campaign_type} 
        onChange={(types) => setFormData({ ...formData, campaign_type: types })} 
      />

      <DateRangeSelector 
        startDate={formData.start_date}
        endDate={formData.end_date}
        onStartDateChange={(date) => setFormData({ ...formData, start_date: date })}
        onEndDateChange={(date) => setFormData({ ...formData, end_date: date })}
      />

      <Input 
        type="number" 
        placeholder="Budget" 
        value={formData.budget} 
        onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })} 
        required 
      />

      <ContentRequirements 
        requirements={formData.content_requirements}
        onAdd={handleAddContentType}
        onChange={handleContentChange}
      />

      <PlatformSelector 
        selectedPlatforms={formData.platforms}
        onChange={handlePlatformSelect}
      />

      <div className="flex gap-4">
        <div>
          <p className="font-medium mb-2">Whitelisting</p>
          <Button 
            type="button" 
            variant={formData.whitelisting ? 'default' : 'outline'} 
            onClick={() => setFormData({ ...formData, whitelisting: !formData.whitelisting })}
          >
            {formData.whitelisting ? 'Yes' : 'No'}
          </Button>
        </div>
        <div>
          <p className="font-medium mb-2">Exclusivity</p>
          <Input 
            placeholder="e.g. 3 months" 
            value={formData.exclusivity} 
            onChange={(e) => setFormData({ ...formData, exclusivity: e.target.value })} 
          />
        </div>
      </div>

      <Button 
        type="button" 
        variant="ghost" 
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />} 
        Additional Details
      </Button>

      {showAdvanced && (
        <Textarea 
          placeholder="Add posting times, hashtag guidelines, tone of voice..." 
          value={formData.description} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
        />
      )}

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={formData.save_as_template} 
          onChange={(e) => setFormData({ ...formData, save_as_template: e.target.checked })} 
        />
        <span>Save as Template</span>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg"
      >
        🚀 Launch Campaign
      </Button>
    </form>
  );
};

export default CreateProjectForm;
