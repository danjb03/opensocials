
'use client'

import React from 'react'
import { useCreateProjectForm, CampaignType } from '@/hooks/useCreateProjectForm'
import { CampaignTypeSelector } from './project-form/CampaignTypeSelector'
import { ContentRequirements } from './project-form/ContentRequirements'
import { PlatformSelector } from './project-form/PlatformSelector'
import { DateRangeSelector } from './project-form/DateRangeSelector'
import { BasicProjectInfo } from './project-form/BasicProjectInfo'
import { BudgetSection } from './project-form/BudgetSection'
import { WhitelistingSection } from './project-form/WhitelistingSection'
import { SaveTemplateCheckbox } from './project-form/SaveTemplateCheckbox'
import { FormSubmitButton } from './project-form/FormSubmitButton'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

const CreateProjectForm = ({ onSuccess, userId }: { onSuccess: (newProject: any) => void, userId: string }) => {
  const {
    formData,
    setFormData,
    showAdvanced,
    setShowAdvanced,
    handleChange,
    handleSubmit,
    loading
  } = useCreateProjectForm(onSuccess, userId)

  const handleAddContentType = (type: 'videos' | 'stories' | 'posts') => {
    setFormData(prevState => ({
      ...prevState,
      content_requirements: {
        ...prevState.content_requirements,
        [type]: { quantity: 1 }
      }
    }));
  };

  const handleContentChange = (type: 'videos' | 'stories' | 'posts', quantity: number) => {
    setFormData(prevState => ({
      ...prevState,
      content_requirements: {
        ...prevState.content_requirements,
        [type]: { quantity }
      }
    }));
  };

  const handlePlatformSelect = (platforms: string[]) => {
    setFormData({ ...formData, platforms });
  };

  const handleWhitelistingToggle = () => {
    setFormData({
      ...formData,
      whitelisting: !formData.whitelisting,
    });
  };

  const handleSaveAsTemplateChange = (checked: boolean) => {
    setFormData({
      ...formData,
      save_as_template: checked,
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-xl">Create New Project</CardTitle>
        <CardDescription>
          Set up your campaign details and requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicProjectInfo 
            name={formData.name}
            description={formData.description}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Campaign Type</label>
            <CampaignTypeSelector
              selectedTypes={formData.campaign_type ? [formData.campaign_type] : []}
              onChange={(types) =>
                setFormData({ ...formData, campaign_type: types.length > 0 ? types[0] as CampaignType : 'single' })
              }
            />
          </div>

          <DateRangeSelector
            startDate={
              formData.start_date ? new Date(formData.start_date) : undefined
            }
            endDate={
              formData.end_date ? new Date(formData.end_date) : undefined
            }
            onStartDateChange={(date) =>
              setFormData({
                ...formData,
                start_date: date ? date.toISOString().split('T')[0] : '',
              })
            }
            onEndDateChange={(date) =>
              setFormData({
                ...formData,
                end_date: date ? date.toISOString().split('T')[0] : '',
              })
            }
          />

          <BudgetSection 
            budget={formData.budget.toString()} 
            onChange={handleChange}
          />

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

          <WhitelistingSection
            whitelisting={formData.whitelisting}
            exclusivity={formData.exclusivity}
            onChange={handleChange}
            onWhitelistingToggle={handleWhitelistingToggle}
          />

          <SaveTemplateCheckbox 
            saveAsTemplate={formData.save_as_template} 
            onChange={handleSaveAsTemplateChange} 
          />

          <FormSubmitButton loading={loading} />
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateProjectForm
