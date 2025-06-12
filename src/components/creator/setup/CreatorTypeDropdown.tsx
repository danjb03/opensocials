
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CREATOR_TYPES = [{
  value: "ugc-creator",
  label: "UGC Creator",
  description: "Branded content, not always front-facing."
}, {
  value: "personal-brand",
  label: "Personal Brand",
  description: "You are the brand. Audience follows you."
}, {
  value: "niche-expert",
  label: "Niche Expert",
  description: "You teach, explain, or break things down."
}, {
  value: "influencer",
  label: "Influencer",
  description: "Trend-driven, lifestyle-led content."
}, {
  value: "performer",
  label: "Performer",
  description: "Music, dance, acting, or creative performance."
}, {
  value: "educator",
  label: "Educator",
  description: "Courses, how-tos, or value-first lessons."
}, {
  value: "entertainer",
  label: "Entertainer",
  description: "You bring the energy—comedy, memes, or chaos."
}, {
  value: "livestreamer",
  label: "Livestreamer",
  description: "You go live often—gaming, chat, or show."
}, {
  value: "reviewer",
  label: "Reviewer",
  description: "You test and review things for your audience."
}, {
  value: "community-builder",
  label: "Community Builder",
  description: "You lead a private group or community."
}, {
  value: "other",
  label: "Other",
  description: "Specify your unique creator type."
}];

interface CreatorTypeDropdownProps {
  selected: string;
  setSelected: (val: string) => void;
}

export function CreatorTypeDropdown({
  selected,
  setSelected
}: CreatorTypeDropdownProps) {
  const [customType, setCustomType] = useState("");
  const selectedType = CREATOR_TYPES.find(type => type.value === selected);
  const isOtherSelected = selected === "other";
  
  const handleSelectChange = (value: string) => {
    setSelected(value);
    if (value !== "other") {
      setCustomType("");
    }
  };

  const handleCustomTypeChange = (value: string) => {
    setCustomType(value);
    // Update the selected value to include the custom type
    setSelected(`other:${value}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="creator-type" className="text-lg font-semibold">
          Creator Type *
        </Label>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Choose the role that best reflects your content style. This helps us match you with the right campaigns, faster.
        </p>
      </div>
      
      <div className="space-y-4">
        <Select value={selected.startsWith('other:') ? 'other' : selected || 'ugc-creator'} onValueChange={handleSelectChange}>
          <SelectTrigger id="creator-type" className="h-auto min-h-[60px] p-4 border-2 border-border hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Select your creator type">
              {selectedType && (
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-base">{selectedType.label}</span>
                  <span className="text-sm text-muted-foreground mt-1">{selectedType.description}</span>
                </div>
              )}
              {selected.startsWith('other:') && (
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-base">Other</span>
                  <span className="text-sm text-muted-foreground mt-1">{customType || "Custom creator type"}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[400px]">
            {CREATOR_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value} className="p-4 cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <span className="font-medium text-base">{type.label}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{type.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isOtherSelected && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Label htmlFor="custom-creator-type" className="text-sm font-medium">
              Describe your creator type
            </Label>
            <Input
              id="custom-creator-type"
              placeholder="e.g., Food Blogger, Tech Reviewer, Fitness Coach..."
              value={customType}
              onChange={(e) => handleCustomTypeChange(e.target.value)}
              className="border-2 border-border focus:border-primary transition-colors"
            />
          </div>
        )}
      </div>

      {(selectedType || selected.startsWith('other:')) && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border animate-in fade-in duration-200">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-medium text-base">
                {selectedType ? selectedType.label : "Custom Creator Type"}
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {selectedType 
                  ? selectedType.description 
                  : customType 
                    ? `You've defined yourself as: ${customType}`
                    : "Please describe your creator type above"
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatorTypeDropdown;
