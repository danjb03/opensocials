
import React from 'react';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface HashtagManagerProps {
  control: Control<any>;
  name: string;
  label: string;
}

export const HashtagManager: React.FC<HashtagManagerProps> = ({
  control,
  name,
  label
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  const watchedValues = useWatch({
    control,
    name
  });

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <Badge key={field.id} variant="secondary" className="pl-3 pr-1">
            {name === 'hashtags' ? '#' : ''}{watchedValues?.[index]?.value}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => remove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: '' })}
          className="h-6"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
