
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CampaignNameFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const CampaignNameField: React.FC<CampaignNameFieldProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" className="text-sm font-medium text-foreground">
        Campaign Name *
      </Label>
      <Input 
        id="name" 
        {...register('name')} 
        placeholder="e.g., Summer Collection Launch 2024" 
        className="text-lg bg-background border-border text-foreground placeholder:text-muted-foreground" 
      />
      {errors.name && (
        <p className="text-sm text-slate-300">{String(errors.name.message || 'Invalid input')}</p>
      )}
    </div>
  );
};
