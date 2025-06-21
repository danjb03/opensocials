
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Clipboard } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';
import { CampaignBrief, CONTENT_FORMAT_OPTIONS, TONE_VIBE_OPTIONS, PLATFORM_OPTIONS } from '@/types/campaignBrief';

const campaignBriefSchema = z.object({
  product_description: z.string().min(1, 'Product description is required'),
  hook: z.string().min(1, 'Hook is required'),
  content_format: z.array(z.string()).min(1, 'At least one content format is required'),
  tone_vibe: z.array(z.string()).min(1, 'At least one tone/vibe is required'),
  key_messaging: z.string().min(1, 'Key messaging is required'),
  platform_destination: z.array(z.string()).min(1, 'At least one platform is required'),
  call_to_action: z.string().min(1, 'Call to action is required'),
  references_restrictions: z.string().optional()
});

type CampaignBriefForm = z.infer<typeof campaignBriefSchema>;

interface CampaignBriefStepProps {
  data?: Partial<CampaignWizardData>;
  onComplete: (data: Partial<CampaignWizardData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const CampaignBriefStep: React.FC<CampaignBriefStepProps> = ({
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
    formState: { errors, isValid }
  } = useForm<CampaignBriefForm>({
    resolver: zodResolver(campaignBriefSchema),
    defaultValues: {
      product_description: data?.brief_data?.product_description || '',
      hook: data?.brief_data?.hook || '',
      content_format: data?.brief_data?.content_format || [],
      tone_vibe: data?.brief_data?.tone_vibe || [],
      key_messaging: data?.brief_data?.key_messaging || '',
      platform_destination: data?.brief_data?.platform_destination || [],
      call_to_action: data?.brief_data?.call_to_action || '',
      references_restrictions: data?.brief_data?.references_restrictions || ''
    },
    mode: 'onChange'
  });

  const watchedContentFormat = watch('content_format');
  const watchedToneVibe = watch('tone_vibe');
  const watchedPlatform = watch('platform_destination');

  const handleCheckboxChange = (value: string, fieldName: 'content_format' | 'tone_vibe' | 'platform_destination') => {
    const currentValues = watch(fieldName);
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    setValue(fieldName, newValues);
  };

  const onSubmit = (formData: CampaignBriefForm) => {
    const brief_data: CampaignBrief = {
      product_description: formData.product_description,
      hook: formData.hook,
      content_format: formData.content_format,
      tone_vibe: formData.tone_vibe,
      key_messaging: formData.key_messaging,
      platform_destination: formData.platform_destination,
      call_to_action: formData.call_to_action,
      references_restrictions: formData.references_restrictions || ''
    };

    onComplete({ brief_data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="bg-background border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <div className="p-2 bg-foreground rounded-lg">
              <Clipboard className="h-5 w-5 text-background" />
            </div>
            Campaign Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor="product_description" className="text-sm font-medium text-foreground">
              1. What are you promoting? *
            </Label>
            <Textarea
              id="product_description"
              {...register('product_description')}
              placeholder="Name the product or service clearly. Be specific (e.g. size, flavour, version)."
              className="bg-background border-border text-foreground"
              rows={3}
            />
            {errors.product_description && (
              <p className="text-sm text-slate-300">{errors.product_description.message}</p>
            )}
          </div>

          {/* Hook */}
          <div className="space-y-2">
            <Label htmlFor="hook" className="text-sm font-medium text-foreground">
              2. What's the hook? *
            </Label>
            <Textarea
              id="hook"
              {...register('hook')}
              placeholder="The compelling angle or story that will grab attention"
              className="bg-background border-border text-foreground"
              rows={3}
            />
            {errors.hook && (
              <p className="text-sm text-slate-300">{errors.hook.message}</p>
            )}
          </div>

          {/* Content Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              3. Content format: *
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {CONTENT_FORMAT_OPTIONS.map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format}`}
                    checked={watchedContentFormat.includes(format)}
                    onCheckedChange={() => handleCheckboxChange(format, 'content_format')}
                  />
                  <Label htmlFor={`format-${format}`} className="text-sm text-foreground">
                    {format}
                  </Label>
                </div>
              ))}
            </div>
            {errors.content_format && (
              <p className="text-sm text-slate-300">{errors.content_format.message}</p>
            )}
          </div>

          {/* Tone & Vibe */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              4. Tone + vibe: *
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {TONE_VIBE_OPTIONS.map((tone) => (
                <div key={tone} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tone-${tone}`}
                    checked={watchedToneVibe.includes(tone)}
                    onCheckedChange={() => handleCheckboxChange(tone, 'tone_vibe')}
                  />
                  <Label htmlFor={`tone-${tone}`} className="text-sm text-foreground">
                    {tone}
                  </Label>
                </div>
              ))}
            </div>
            {errors.tone_vibe && (
              <p className="text-sm text-slate-300">{errors.tone_vibe.message}</p>
            )}
          </div>

          {/* Key Messaging */}
          <div className="space-y-2">
            <Label htmlFor="key_messaging" className="text-sm font-medium text-foreground">
              5. What you'll say or show: *
            </Label>
            <Textarea
              id="key_messaging"
              {...register('key_messaging')}
              placeholder="Key product features, discount code, USP, etc."
              className="bg-background border-border text-foreground"
              rows={4}
            />
            {errors.key_messaging && (
              <p className="text-sm text-slate-300">{errors.key_messaging.message}</p>
            )}
          </div>

          {/* Platform Destination */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              6. Where will it go live? *
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {PLATFORM_OPTIONS.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={watchedPlatform.includes(platform)}
                    onCheckedChange={() => handleCheckboxChange(platform, 'platform_destination')}
                  />
                  <Label htmlFor={`platform-${platform}`} className="text-sm text-foreground">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
            {errors.platform_destination && (
              <p className="text-sm text-slate-300">{errors.platform_destination.message}</p>
            )}
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <Label htmlFor="call_to_action" className="text-sm font-medium text-foreground">
              7. Your CTA: *
            </Label>
            <Input
              id="call_to_action"
              {...register('call_to_action')}
              placeholder="e.g., 'Use my code', 'Link in bio', or 'Brand awareness only'"
              className="bg-background border-border text-foreground"
            />
            {errors.call_to_action && (
              <p className="text-sm text-slate-300">{errors.call_to_action.message}</p>
            )}
          </div>

          {/* References & Restrictions */}
          <div className="space-y-2">
            <Label htmlFor="references_restrictions" className="text-sm font-medium text-foreground">
              8. Any references or no-gos?
            </Label>
            <Textarea
              id="references_restrictions"
              {...register('references_restrictions')}
              placeholder="Drop links to inspiration, or flag anything you won't include."
              className="bg-background border-border text-foreground"
              rows={3}
            />
          </div>
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

export default CampaignBriefStep;
