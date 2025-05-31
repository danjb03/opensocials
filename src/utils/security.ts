import DOMPurify from 'isomorphic-dompurify';
import {
  validateEmail,
  sanitizeString as baseSanitizeString,
  validateUrl,
  sanitizeUrl,
  validateSocialHandle
} from '../../shared/security';
export { validateEmail, validateUrl, sanitizeUrl, validateSocialHandle };


export const sanitizeString = (input: string, maxLength: number = 255): string => {
  if (!input || typeof input !== "string") return "";
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
  return baseSanitizeString(cleaned, maxLength);
};


// Enhanced HTML sanitization for rich content
export const sanitizeHtml = (html: string, options: {
  allowedTags?: string[];
  allowedAttributes?: string[];
  maxLength?: number;
} = {}): string => {
  if (!html || typeof html !== 'string') return '';
  
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    allowedAttributes = [],
    maxLength = 5000
  } = options;
  
  const cleaned = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes
  });
  
  return cleaned.slice(0, maxLength);
};

export const sanitizeSocialHandle = (handle: string): string => {
  if (!handle || typeof handle !== 'string') return '';
  
  // Remove @ prefix and sanitize
  const clean = handle.replace(/^@/, '');
  const sanitized = sanitizeString(clean, 30);
  
  // Validate the result
  return validateSocialHandle(sanitized) ? sanitized : '';
};

// Password strength validation with security requirements
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
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
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /(.)\1{3,}/, // Repeated characters
  ];
  
  if (weakPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common weak patterns');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Input sanitization for form data
export const sanitizeFormData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Rate limiting check (client-side helper)
export const checkClientRateLimit = (
  action: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const key = `rate_limit_${action}`;
  const data = localStorage.getItem(key);
  
  if (!data) {
    localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }));
    return true;
  }
  
  try {
    const { count, resetTime } = JSON.parse(data);
    
    if (now > resetTime) {
      localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }));
      return true;
    }
    
    if (count >= maxRequests) {
      return false;
    }
    
    localStorage.setItem(key, JSON.stringify({ count: count + 1, resetTime }));
    return true;
  } catch {
    localStorage.removeItem(key);
    return true;
  }
};

// Security headers for API requests
export const getSecurityHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
});
