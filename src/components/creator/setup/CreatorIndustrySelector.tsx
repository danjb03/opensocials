
import React from "react";
import { industries, industryCategories } from "@/data/industries";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface CreatorIndustrySelectorProps {
  selected: string[];
  setSelected: (val: string[]) => void;
  maxSelections?: number;
}

export function CreatorIndustrySelector({ 
  selected, 
  setSelected, 
  maxSelections = 3 
}: CreatorIndustrySelectorProps) {
  const toggle = (tag: string) => {
    setSelected(
      selected.includes(tag)
        ? selected.filter(t => t !== tag)
        : selected.length < maxSelections
        ? [...selected, tag]
        : selected
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">What kind of content do you create?</h3>
        <p className="text-sm text-muted-foreground">Choose up to {maxSelections} categories that best describe your niche.</p>
      </div>
      
      <div>
        {industryCategories.map((category) => (
          <div key={category.name} className="mb-4">
            <h4 className="text-sm font-medium mb-2">{category.name}</h4>
            <div className="flex flex-wrap gap-2">
              {category.industries.map((tag) => (
                <Toggle
                  key={tag}
                  pressed={selected.includes(tag)}
                  onPressedChange={() => toggle(tag)}
                  variant="outline"
                  className={cn(
                    "px-3 py-1 h-auto text-sm rounded-full border", 
                    selected.includes(tag) ? 
                      "bg-primary text-primary-foreground" : 
                      "bg-background text-foreground"
                  )}
                  disabled={selected.length >= maxSelections && !selected.includes(tag)}
                >
                  {tag}
                </Toggle>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {selected.length > 0 && (
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Selected Industries ({selected.length}/{maxSelections})</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(tag => (
              <div 
                key={`selected-${tag}`} 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm"
              >
                {tag}
                <button
                  onClick={() => toggle(tag)}
                  className="ml-1 rounded-full hover:bg-primary-foreground/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatorIndustrySelector;
