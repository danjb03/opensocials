
// Input sanitization and validation utilities
import DOMPurify from 'isomorphic-dompurify';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// HTML sanitization
export const sanitizeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: []
  });
};

// Basic string sanitization
export const sanitizeString = (input: string, maxLength: number = 255): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// URL validation and sanitization
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const parsedUrl = new URL(url);
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
};

// Social media handle validation
export const validateSocialHandle = (handle: string, platform: string): ValidationResult => {
  const errors: string[] = [];
  let isValid = true;

  if (!handle) {
    return { isValid: true, errors: [] }; // Optional field
  }

  // Remove @ symbol if present
  const cleanHandle = handle.replace(/^@/, '');

  // Basic validation
  if (cleanHandle.length < 1 || cleanHandle.length > 30) {
    errors.push(`${platform} handle must be between 1 and 30 characters`);
    isValid = false;
  }

  // Check for valid characters (alphanumeric, underscore, period)
  if (!/^[a-zA-Z0-9._]+$/.test(cleanHandle)) {
    errors.push(`${platform} handle contains invalid characters`);
    isValid = false;
  }

  return { isValid, errors };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  if (!emailRegex.test(email) || email.length > 254) {
    errors.push('Invalid email format');
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [] };
};

// Generic field validation
export const validateField = (value: string, fieldName: string, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];
  let isValid = true;

  if (rules.required && (!value || value.trim().length === 0)) {
    errors.push(`${fieldName} is required`);
    isValid = false;
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    isValid = false;
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push(`${fieldName} must not exceed ${rules.maxLength} characters`);
    isValid = false;
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push(`${fieldName} format is invalid`);
    isValid = false;
  }

  if (value && rules.customValidator && !rules.customValidator(value)) {
    errors.push(`${fieldName} is invalid`);
    isValid = false;
  }

  return { isValid, errors };
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }

    const userRequests = requests.get(identifier)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    validRequests.push(now);
    requests.set(identifier, validRequests);
    
    return true;
  };
};
