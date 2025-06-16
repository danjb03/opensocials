
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  bgColor, 
  iconColor, 
  textColor 
}: MetricCardProps) {
  return (
    <div
      className={`${bgColor} rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-muted/30 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className={`font-semibold text-lg ${textColor}`}>{title}</h3>
        <p className={`text-sm text-muted-foreground`}>{description}</p>
      </div>
    </div>
  );
}
