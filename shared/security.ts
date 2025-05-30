// Shared sanitization and validation helpers used across frontend and edge functions

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const sanitizeString = (input: string, maxLength: number = 255): string => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
};

export const validateUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return true;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url: string): string => {
  return validateUrl(url) ? new URL(url).toString() : '';
};

export const validateSocialHandle = (handle: string): boolean => {
  if (!handle || typeof handle !== 'string') return true;
  const clean = handle.replace(/^@/, '');
  return clean.length <= 30 && /^[a-zA-Z0-9._]+$/.test(clean);
};
