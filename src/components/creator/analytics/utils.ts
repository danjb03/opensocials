
export const PLATFORM_CONFIG = {
  instagram: { name: 'Instagram', icon: 'Camera', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  tiktok: { name: 'TikTok', icon: 'Play', color: 'bg-black' },
  youtube: { name: 'YouTube', icon: 'Play', color: 'bg-red-600' },
  twitter: { name: 'Twitter/X', icon: 'MessageCircle', color: 'bg-blue-500' },
  twitch: { name: 'Twitch', icon: 'Play', color: 'bg-purple-600' },
  facebook: { name: 'Facebook', icon: 'Users', color: 'bg-blue-700' },
  linkedin: { name: 'LinkedIn', icon: 'Users', color: 'bg-blue-600' },
};

export const formatNumber = (num: number | null): string => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatPercentage = (num: number | null): string => {
  if (!num) return '0%';
  return `${num.toFixed(1)}%`;
};

export const safeToNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const safeToString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return String(value || '');
};
