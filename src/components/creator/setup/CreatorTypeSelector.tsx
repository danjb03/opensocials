
import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const CREATOR_TYPES = [
  { label: "UGC Creator", description: "Branded content, not always front-facing." },
  { label: "Personal Brand", description: "You are the brand. Audience follows you." },
  { label: "Niche Expert", description: "You teach, explain, or break things down." },
  { label: "Influencer", description: "Trend-driven, lifestyle-led content." },
  { label: "Performer", description: "Music, dance, acting, or creative performance." },
  { label: "Educator", description: "Courses, how-tos, or value-first lessons." },
  { label: "Entertainer", description: "You bring the energy—comedy, memes, or chaos." },
  { label: "Livestreamer", description: "You go live often—gaming, chat, or show." },
  { label: "Reviewer", description: "You test and review things for your audience." },
  { label: "Community Builder", description: "You lead a private group or community." }
];

interface CreatorTypeSelectorProps {
  selected: string;
  setSelected: (val: string) => void;
}

export function CreatorTypeSelector({ selected, setSelected }: CreatorTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">What best describes the kind of creator you are?</h3>
        <p className="text-sm text-muted-foreground">Pick the one that fits your style the most.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-3">
        {CREATOR_TYPES.map((type) => (
          <Card
            key={type.label}
            className={cn(
              "p-3 cursor-pointer transition-colors border",
              selected === type.label 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card hover:bg-accent/50"
            )}
            onClick={() => setSelected(type.label)}
          >
            <p className="font-medium">{type.label}</p>
            <p className={cn(
              "text-sm",
              selected === type.label ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {type.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CreatorTypeSelector;
