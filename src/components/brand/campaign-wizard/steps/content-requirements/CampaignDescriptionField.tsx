
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CampaignDescriptionFieldProps {
  register: UseFormRegister<any>;
  error?: string;
}

export const CampaignDescriptionField: React.FC<CampaignDescriptionFieldProps> = ({
  register,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="text-sm font-medium text-foreground">
        Campaign Description *
      </Label>
      <Textarea
        id="description"
        {...register('description')}
        placeholder="Describe your campaign goals, target audience, and key messages..."
        rows={4}
        className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground"
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
