
// Shared security utilities for Edge Functions
export interface RateLimitConfig {
  identifier: string;
  action: string;
  maxRequests: number;
  windowMinutes: number;
}

export interface SecurityAuditLog {
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// Security utilities defined directly here for edge function environment
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

export const checkRateLimit = async (supabase: any, config: RateLimitConfig): Promise<boolean> => {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - config.windowMinutes);

  try {
    // Clean up old entries
    await supabase
      .from('rate_limits')
      .delete()
      .lt('window_start', windowStart.toISOString());

    // Check current rate
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('count')
      .eq('identifier', config.identifier)
      .eq('action', config.action)
      .gte('window_start', windowStart.toISOString())
      .single();

    if (existing && existing.count >= config.maxRequests) {
      return false; // Rate limit exceeded
    }

    // Update or insert rate limit record
    await supabase
      .from('rate_limits')
      .upsert({
        identifier: config.identifier,
        action: config.action,
        count: (existing?.count || 0) + 1,
        window_start: windowStart.toISOString()
      }, {
        onConflict: 'identifier,action,window_start'
      });

    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow on error to prevent blocking legitimate requests
  }
};

export const logSecurityEvent = async (supabase: any, event: SecurityAuditLog): Promise<void> => {
  try {
    await supabase
      .from('security_audit_log')
      .insert({
        user_id: event.user_id,
        action: sanitizeString(event.action, 100),
        resource_type: sanitizeString(event.resource_type, 50),
        resource_id: event.resource_id ? sanitizeString(event.resource_id, 100) : null,
        ip_address: event.ip_address,
        user_agent: event.user_agent ? sanitizeString(event.user_agent, 500) : null
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const extractClientInfo = (req: Request) => {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip_address = forwarded ? forwarded.split(',')[0].trim() : 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  const user_agent = req.headers.get('user-agent') || 'unknown';
  
  return { ip_address, user_agent };
};
