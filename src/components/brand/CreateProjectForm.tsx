
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
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

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
    <Card className="w-full shadow-md">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-xl">Create New Project</CardTitle>
        <CardDescription>Set up your campaign details and requirements</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <Input 
              placeholder="Project Name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
              className="border-slate-300 focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Campaign Type</label>
            <CampaignTypeSelector 
              selectedTypes={formData.campaign_type} 
              onChange={(types) => setFormData({ ...formData, campaign_type: types })} 
            />
          </div>

          <DateRangeSelector 
            startDate={formData.start_date ? new Date(formData.start_date) : undefined}
            endDate={formData.end_date ? new Date(formData.end_date) : undefined}
            onStartDateChange={(date) => setFormData({ ...formData, start_date: date ? date.toISOString().split('T')[0] : '' })}
            onEndDateChange={(date) => setFormData({ ...formData, end_date: date ? date.toISOString().split('T')[0] : '' })}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Budget</label>
            <Input 
              type="number" 
              placeholder="Budget" 
              value={formData.budget} 
              onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })} 
              required 
              className="border-slate-300 focus-visible:ring-blue-500"
            />
          </div>

          <ContentRequirements 
            requirements={formData.content_requirements}
            onAdd={handleAddContentType}
            onChange={handleContentChange}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Platforms</label>
            <PlatformSelector 
              selectedPlatforms={formData.platforms}
              onChange={handlePlatformSelect}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-2">Whitelisting</p>
              <Button 
                type="button" 
                variant={formData.whitelisting ? 'default' : 'outline'} 
                onClick={() => setFormData({ ...formData, whitelisting: !formData.whitelisting })}
                className={formData.whitelisting ? "bg-blue-600 hover:bg-blue-700" : ""}
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
                className="border-slate-300 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-start text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            {showAdvanced ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />} 
            Additional Details
          </Button>

          {showAdvanced && (
            <Textarea 
              placeholder="Add posting times, hashtag guidelines, tone of voice..." 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className="min-h-[120px] border-slate-300 focus-visible:ring-blue-500"
            />
          )}

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.save_as_template} 
              onChange={(e) => setFormData({ ...formData, save_as_template: e.target.checked })} 
            />
            <span className="text-sm text-gray-600">Save as Template</span>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-medium py-3"
          >
            🚀 Launch Campaign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProjectForm;
