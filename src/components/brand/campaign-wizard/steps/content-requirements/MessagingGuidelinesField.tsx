
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MessagingGuidelinesFieldProps {
  register: UseFormRegister<any>;
}

export const MessagingGuidelinesField: React.FC<MessagingGuidelinesFieldProps> = ({
  register
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="messaging_guidelines" className="text-sm font-medium text-foreground">
        Messaging Guidelines
      </Label>
      <Textarea
        id="messaging_guidelines"
        {...register('messaging_guidelines')}
        placeholder="Key messages, tone of voice, brand guidelines..."
        rows={3}
        className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
};
