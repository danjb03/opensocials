
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Plus, X, Instagram, Video, Image, PlayCircle, Zap, Smartphone } from 'lucide-react';
import { CampaignWizardData, Platform, ContentType } from '@/types/campaignWizard';

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

const platformOptions = [
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" />, color: 'bg-pink-100 text-pink-700' },
  { value: 'tiktok', label: 'TikTok', icon: <Video className="h-4 w-4" />, color: 'bg-black text-white' },
  { value: 'youtube', label: 'YouTube', icon: <PlayCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
  { value: 'twitter', label: 'Twitter/X', icon: <Zap className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
  { value: 'linkedin', label: 'LinkedIn', icon: <Image className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
];

const contentTypeOptions = [
  { value: 'post', label: 'Feed Posts', description: 'Standard social media posts' },
  { value: 'story', label: 'Stories', description: '24-hour temporary content' },
  { value: 'reel', label: 'Reels/Short Videos', description: 'Short-form vertical videos' },
  { value: 'video', label: 'Long-form Videos', description: 'YouTube videos, IGTV' },
  { value: 'live', label: 'Live Streams', description: 'Real-time streaming content' },
  { value: 'carousel', label: 'Carousel Posts', description: 'Multi-image/video posts' },
];

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

  const { fields: hashtagFields, append: appendHashtag, remove: removeHashtag } = useFieldArray({
    control,
    name: 'hashtags'
  });

  const { fields: mentionFields, append: appendMention, remove: removeMention } = useFieldArray({
    control,
    name: 'mentions'
  });

  const { fields: restrictionFields, append: appendRestriction, remove: removeRestriction } = useFieldArray({
    control,
    name: 'restrictions'
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />Content Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Campaign Description *
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your campaign goals, target audience, and key messages..."
              rows={4}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Platforms */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Target Platforms *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platformOptions.map((platform) => (
                <Label
                  key={platform.value}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedPlatforms?.includes(platform.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Checkbox
                    checked={watchedPlatforms?.includes(platform.value) || false}
                    onCheckedChange={(checked) => 
                      handlePlatformChange(platform.value, checked as boolean)
                    }
                  />
                  <div className={`p-1 rounded ${platform.color}`}>
                    {platform.icon}
                  </div>
                  <span className="font-medium">{platform.label}</span>
                </Label>
              ))}
            </div>
            {errors.platforms && (
              <p className="text-sm text-red-600">{errors.platforms.message}</p>
            )}
          </div>

          {/* Content Types */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Content Types *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contentTypeOptions.map((contentType) => (
                <Label
                  key={contentType.value}
                  className={`
                    flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${watchedContentTypes?.includes(contentType.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Checkbox
                    checked={watchedContentTypes?.includes(contentType.value) || false}
                    onCheckedChange={(checked) => 
                      handleContentTypeChange(contentType.value, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <span className="font-medium">{contentType.label}</span>
                    <p className="text-sm text-gray-600">{contentType.description}</p>
                  </div>
                </Label>
              ))}
            </div>
            {errors.content_types && (
              <p className="text-sm text-red-600">{errors.content_types.message}</p>
            )}
          </div>

          {/* Messaging Guidelines */}
          <div className="space-y-2">
            <Label htmlFor="messaging_guidelines" className="text-sm font-medium">
              Messaging Guidelines
            </Label>
            <Textarea
              id="messaging_guidelines"
              {...register('messaging_guidelines')}
              placeholder="Key messages, tone of voice, brand guidelines..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Required Hashtags</Label>
            <div className="flex flex-wrap gap-2">
              {hashtagFields.map((field, index) => (
                <Badge key={field.id} variant="secondary" className="pl-3 pr-1">
                  #{watch(`hashtags.${index}.value`)}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeHashtag(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendHashtag({ value: '' })}
                className="h-6"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
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
          className="flex items-center gap-2"
        >
          Continue to Budget & Deliverables
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ContentRequirementsStep;
