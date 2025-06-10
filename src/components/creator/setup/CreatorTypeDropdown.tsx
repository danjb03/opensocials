
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
}];

interface CreatorTypeDropdownProps {
  selected: string;
  setSelected: (val: string) => void;
}

export function CreatorTypeDropdown({
  selected,
  setSelected
}: CreatorTypeDropdownProps) {
  const selectedType = CREATOR_TYPES.find(type => type.value === selected);
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="creator-type">Creator Type *</Label>
        <p className="text-muted-foreground mt-1 text-xs font-normal">Choose the role that best reflects your content style, this helps us match you with the right campaigns, faster.</p>
      </div>
      
      <Select value={selected || 'ugc-creator'} onValueChange={setSelected}>
        <SelectTrigger id="creator-type">
          <SelectValue placeholder="Select your creator type" />
        </SelectTrigger>
        <SelectContent>
          {CREATOR_TYPES.map(type => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex flex-col">
                <span className="font-medium">{type.label}</span>
                <span className="text-sm text-muted-foreground">{type.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedType && (
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">{selectedType.label}</p>
          <p className="text-sm text-muted-foreground">{selectedType.description}</p>
        </div>
      )}
    </div>
  );
}

export default CreatorTypeDropdown;
