/**
 * Utility functions for frontend security and input sanitization.
 */

export class SecurityUtils {
  /**
   * Sanitizes a string input to prevent XSS and other injection attacks.
   * Note: This is a frontend layer of defense. Backend validation is always required.
   */
  static sanitizeInput(input: string | null | undefined): string {
    if (!input) return '';

    // Skip sanitization for Base64 data URLs (images) to avoid corruption
    if (input.startsWith('data:image/')) {
      return input;
    }

    // Remove complex script tags, event handlers, and malicious URI schemes (Snyk Best Practice)
    let sanitized = input
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '') // <script> tags
      .replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gim, '') // any on* event handlers
      .replace(/javascript\s*:[^\s>]+/gim, '') // javascript: URIs
      .replace(/data\s*:[^\s>]+;base64[^\s>]+/gim, (match) => match.startsWith('data:image/') ? match : '') // base64 except images
      .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, '') // iframes
      .replace(/<object\b[^>]*>([\s\S]*?)<\/object>/gim, ''); // objects

    // Escape basic HTML characters to prevent rendering as tags
    const entityMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return sanitized.replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
  }

  /**
   * Sanitizes all string properties of an object.
   */
  static sanitizeObject<T extends object>(obj: T): T {
    const result = { ...obj } as any;
    for (const key in result) {
      if (typeof result[key] === 'string') {
        result[key] = this.sanitizeInput(result[key]);
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = this.sanitizeObject(result[key]);
      }
    }
    return result;
  }
}
