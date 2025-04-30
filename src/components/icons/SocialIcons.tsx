
import React from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Make TikTokIcon accept the same props as Lucide icons
export const TikTokIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ color = 'currentColor', size = 24, strokeWidth = 2, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    );
  }
);

TikTokIcon.displayName = 'TikTokIcon';

export { Instagram, Linkedin, Youtube };
