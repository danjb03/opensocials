
import DOMPurify from 'isomorphic-dompurify';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeString = (input: string, maxLength: number = 255): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove any potentially harmful characters and limit length
  const sanitized = DOMPurify.sanitize(input.trim(), { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  return sanitized.slice(0, maxLength);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { isValid: errors.length === 0, errors };
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

export const sanitizeSocialHandle = (handle: string): string => {
  if (!handle || typeof handle !== 'string') return '';
  // Remove @ symbol and sanitize
  const clean = handle.replace(/^@/, '').trim();
  // Only allow alphanumeric characters, dots, and underscores
  const sanitized = clean.replace(/[^a-zA-Z0-9._]/g, '');
  return sanitized.slice(0, 30);
};

interface SanitizeHtmlOptions {
  allowedTags?: string[];
  maxLength?: number;
}

export const sanitizeHtml = (input: string, options: SanitizeHtmlOptions = {}): string => {
  if (!input || typeof input !== 'string') return '';
  
  const { allowedTags = [], maxLength = 1000 } = options;
  
  const sanitized = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: []
  });
  
  return sanitized.slice(0, maxLength);
};
