
export interface CampaignBrief {
  product_description: string;
  hook: string;
  content_format: string[];
  tone_vibe: string[];
  key_messaging: string;
  platform_destination: string[];
  call_to_action: string;
  references_restrictions: string;
}

export const CONTENT_FORMAT_OPTIONS = [
  'Face to camera',
  'GRWM / vlog / voiceover',
  'Trend / challenge',
  'Demo / unboxing',
  'Results-based',
  'Other'
] as const;

export const TONE_VIBE_OPTIONS = [
  'Bold + fast',
  'Chill + aesthetic',
  'Relatable / funny',
  'Minimal / luxe',
  'Other'
] as const;

export const PLATFORM_OPTIONS = [
  'TikTok',
  'Instagram Reels',
  'Instagram Feed',
  'Instagram Stories',
  'YouTube Shorts',
  'YouTube Long-form',
  'Twitter/X',
  'LinkedIn',
  'Other'
] as const;
