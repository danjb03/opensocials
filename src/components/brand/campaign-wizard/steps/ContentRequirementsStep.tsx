
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Smartphone } from 'lucide-react';
import { CampaignWizardData, Platform, ContentType } from '@/types/campaignWizard';
import { PlatformSelector } from './content-requirements/PlatformSelector';
import { ContentTypeSelector } from './content-requirements/ContentTypeSelector';
import { HashtagManager } from './content-requirements/HashtagManager';
import { CampaignDescriptionField } from './content-requirements/CampaignDescriptionField';
import { MessagingGuidelinesField } from './content-requirements/MessagingGuidelinesField';

const contentRequirementsSchema = z.object({
  description: z.string().min(10, 'Campaign description must be at least 10 characters'),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  content_types: z.array(z.string()).min(1, 'Select at least one content type'),
  messaging_guidelines: z.string().optional(),
  hashtags: z.array(z.object({ value: z.string() })).optional(),
  mentions: z.array(z.object({ value: z.string() })).optional(),
  restrictions: z.array(z.object({ value: z.string() })).optional(),
});

type ContentRequirementsForm = z.infer<typeof contentRequirementsSchema>;

interface ContentRequirementsStepProps {
  data?: Partial<CampaignWizardData>;
  onComplete: (data: Partial<CampaignWizardData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const ContentRequirementsStep: React.FC<ContentRequirementsStepProps> = ({
  data,
  onComplete,
  onBack,
  isLoading
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isValid }
  } = useForm<ContentRequirementsForm>({
    resolver: zodResolver(contentRequirementsSchema),
    defaultValues: {
      description: data?.description || '',
      platforms: data?.content_requirements?.platforms || [],
      content_types: data?.content_requirements?.content_types || [],
      messaging_guidelines: data?.messaging_guidelines || '',
      hashtags: data?.content_requirements?.hashtags?.map(tag => ({ value: tag })) || [],
      mentions: data?.content_requirements?.mentions?.map(mention => ({ value: mention })) || [],
      restrictions: data?.content_requirements?.restrictions?.map(restriction => ({ value: restriction })) || []
    },
    mode: 'onChange'
  });

  const watchedPlatforms = watch('platforms');
  const watchedContentTypes = watch('content_types');

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const current = watchedPlatforms || [];
    if (checked) {
      setValue('platforms', [...current, platform]);
    } else {
      setValue('platforms', current.filter(p => p !== platform));
    }
  };

  const handleContentTypeChange = (contentType: string, checked: boolean) => {
    const current = watchedContentTypes || [];
    if (checked) {
      setValue('content_types', [...current, contentType]);
    } else {
      setValue('content_types', current.filter(ct => ct !== contentType));
    }
  };

  const onSubmit = (formData: ContentRequirementsForm) => {
    const content_requirements = {
      platforms: formData.platforms as Platform[],
      content_types: formData.content_types as ContentType[],
      hashtags: formData.hashtags?.map(h => h.value) || [],
      mentions: formData.mentions?.map(m => m.value) || [],
      restrictions: formData.restrictions?.map(r => r.value) || []
    };

    onComplete({
      description: formData.description,
      content_requirements,
      messaging_guidelines: formData.messaging_guidelines
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="bg-background border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <div className="p-2 bg-foreground rounded-lg">
              <Smartphone className="h-5 w-5 text-background" />
            </div>
            Content Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CampaignDescriptionField 
            register={register}
            error={errors.description?.message}
          />

          <PlatformSelector
            selectedPlatforms={watchedPlatforms}
            onPlatformChange={handlePlatformChange}
            error={errors.platforms?.message}
          />

          <ContentTypeSelector
            selectedContentTypes={watchedContentTypes}
            onContentTypeChange={handleContentTypeChange}
            error={errors.content_types?.message}
          />

          <MessagingGuidelinesField register={register} />

          <HashtagManager
            control={control}
            name="hashtags"
            label="Required Hashtags"
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={!isValid || isLoading}
          className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
        >
          Continue to Budget & Deliverables
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ContentRequirementsStep;
