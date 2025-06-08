
import { useState, useEffect, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface FieldState {
  value: any;
  error: string | null;
  isValidating: boolean;
  success: boolean;
  touched: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  schema: ValidationSchema,
  debounceMs: number = 300
) {
  const [fields, setFields] = useState<Record<keyof T, FieldState>>(() => {
    const initialFields: Record<keyof T, FieldState> = {} as any;
    Object.keys(initialValues).forEach(key => {
      initialFields[key as keyof T] = {
        value: initialValues[key],
        error: null,
        isValidating: false,
        success: false,
        touched: false
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T, value: any): string | null => {
    const rules = schema[name as string];
    if (!rules) return null;

    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'This field is required';
    }

    if (rules.minLength && value && value.toString().length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value && value.toString().length > rules.maxLength) {
      return `Must be less than ${rules.maxLength} characters`;
    }

    if (rules.pattern && value && !rules.pattern.test(value.toString())) {
      return 'Invalid format';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [schema]);

  const setValue = useCallback((name: keyof T, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true,
        isValidating: true,
        success: false,
        error: null
      }
    }));

    // Debounced validation
    const timeoutId = setTimeout(() => {
      const error = validateField(name, value);
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          isValidating: false,
          error,
          success: !error && value !== ''
        }
      }));
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [validateField, debounceMs]);

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(fields).forEach(key => {
      const name = key as keyof T;
      const error = validateField(name, fields[name].value);
      newFields[name] = {
        ...newFields[name],
        error,
        success: !error && fields[name].value !== '',
        touched: true,
        isValidating: false
      };
      if (error) isValid = false;
    });

    setFields(newFields);
    return isValid;
  }, [fields, validateField]);

  const getValues = useCallback((): T => {
    const values = {} as T;
    Object.keys(fields).forEach(key => {
      values[key as keyof T] = fields[key as keyof T].value;
    });
    return values;
  }, [fields]);

  const reset = useCallback(() => {
    setFields(prev => {
      const resetFields = { ...prev };
      Object.keys(resetFields).forEach(key => {
        resetFields[key as keyof T] = {
          ...resetFields[key as keyof T],
          value: initialValues[key as keyof T],
          error: null,
          success: false,
          touched: false,
          isValidating: false
        };
      });
      return resetFields;
    });
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    fields,
    setValue,
    validateAll,
    getValues,
    reset,
    isSubmitting,
    setIsSubmitting
  };
}
