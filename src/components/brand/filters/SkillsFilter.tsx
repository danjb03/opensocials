
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface SkillsFilterProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export function SkillsFilter({ skills, onSkillsChange }: SkillsFilterProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        onSkillsChange([...skills, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeSkill = (skill: string) => {
    onSkillsChange(skills.filter(s => s !== skill));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="skills" className="text-sm">Skills / Keywords</Label>
      <Input
        id="skills"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add skills (press Enter)"
        className="text-sm"
      />
      
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map(skill => (
            <Badge 
              key={skill} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
